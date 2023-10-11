
import { Client, Environment, ApiError } from "square";

const client = new Client({
  accessToken: import.meta.env.SQUARE_ACCESS_TOKEN,
  // environment: Environment.Sandbox,
  environment: Environment.Production,
});

const { catalogApi } = client;

export interface sqCatalog {
  items: sqItem[];
}

export interface sqItem {
  id: string;
  name: string;
  image_url: string;
  variations: sqVariation[];
  price_range: [number, number];
}

export interface sqVariation {
  id: string;
  name: string;
  price: [number, string];
  image_url: string;
}

export async function fetchSquareCatalogTest(catalog: JSON): Promise<sqCatalog> {
  const objects = catalog.objects;

  const items: sqItem[] = [];
  const images = new Map();

  objects.forEach((item) => {
    if (item.type !== 'IMAGE' || item.is_deleted) {
      return;
    }
    if (item.imageData === undefined) {
      console.log(item);
      
      throw new Error("image has no imageData");
    }
    images.set(item.id, item.imageData.url);
  });
  
  objects.forEach((item) => {
    if (item.type !== 'ITEM' || item.is_deleted) {
      return;
    }

    let price_min = 10000000;
    let price_max = 0;

    const vs: sqVariation[] = [];

    if (item.itemData.variations === undefined || item.itemData.variations === null) {
      console.log("item = ", item);
      throw new Error("item has no variations");
    }

    let image_url = "";

    if (item.itemData?.imageIds !== undefined) {
      const image_id = item.itemData?.imageIds[0];
      // console.log(image_id);
      image_url = images.get(image_id);
    }

    item.itemData.variations.forEach((v) => {
      
      // console.log("wat v 1");
      // console.log("v = ", v);
      
      // console.log("ids = ", v.itemVariationData);

      let v_image_url = "";

      if (v.itemVariationData?.imageIds !== undefined && v.itemVariationData?.imageIds?.length > 0) {
        // console.log("wat 2");
        const image_id = v.itemVariationData?.imageIds[0];
        v_image_url = images.get(image_id);
      } else {
        // console.log("wat 3");
        v_image_url = "";
      }

      if (v.itemVariationData.priceMoney.currency !== "CAD") {
        throw new Error("price not in CAD");
      }

      const price = Number(v.itemVariationData.priceMoney.amount);
      price_min = Math.min(price_min, price);
      price_max = Math.max(price_max, price);
      
      // console.log("wat v 2");

      try {
        const sv: sqVariation = {
          id: v.id,
          name: v.itemVariationData.name,
          price: [price, v.itemVariationData.priceMoney.currency],
          image_url: v_image_url,
        };

        // console.log("sv = ", sv);
        
        vs.push(sv);
      } catch (error) {
        console.log("item = ", item);
        console.log("v = ", v);
        
        console.log("error = ", error);
      }

    });
    
    // console.log("wat 3");

    const x: sqItem = {
      id: item.id,
      name: item.itemData.name,
      variations: vs,
      image_url: image_url,
      price_range: [price_min, price_max],
    };

    // console.log("x = ", x);
    items.push(x);
    // console.log(x.variations[0].image_url);
    // console.log(x.variations[0].price);
    // console.log(item);
    // console.log(item.itemData);
  });

  // console.log(items.length);

  return {
    items: items
  };
}

export async function fetchSquareCatalog(): Promise<sqCatalog> {
  try {
    // @ts-expect-error: unused variables
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { result, ...httpResponse } = await catalogApi.listCatalog(undefined, 'ITEM,IMAGE');
    // Get more response info...
    // const { statusCode, headers } = httpResponse;

    return fetchSquareCatalogTest(result);

  } catch (error) {
    if (error instanceof ApiError) {
      // @ts-expect-error: unused variables
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errors = error.result;
      // const { statusCode, headers } = error;
    }
  }
}

export async function fetchSquareCatalogPrev(): Promise<sqCatalog> {
  try {
    // @ts-expect-error: unused variables
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { result, ...httpResponse } = await catalogApi.listCatalog(undefined, 'ITEM,IMAGE');
    // Get more response info...
    // const { statusCode, headers } = httpResponse;

    // console.log(result);

    const items: sqItem[] = [];
    const images = new Map();

    if (result.objects === undefined) {
      throw new Error("result.objects is undefined");
    }
    
    result.objects.forEach((item) => {
      if (item.type !== 'IMAGE') {
        return;
      }
      if (item.imageData === undefined) {
        throw new Error("image has no imageData");
      }
      images.set(item.id, item.imageData.url);
    });

    // console.log("len = ", result.objects.length);

    result.objects.forEach((item) => {
      if (item.type !== 'ITEM') {
        return;
      }

      const vs: sqVariation[] = [];

      if (item.itemData?.variations === undefined || item.itemData?.variations === null) {
        throw new Error("item has no variations");
      }

      item.itemData.variations.forEach((v) => {
        
        // console.log("wat v 1");
        // console.log("v = ", v);
        
        // console.log("ids = ", v.itemVariationData);

        let image_url = "";

        if (v.itemVariationData?.imageIds !== undefined && v.itemVariationData?.imageIds?.length > 0) {
          // console.log("wat 2");
          const image_id = v.itemVariationData?.imageIds[0];
          image_url = images.get(image_id);
        } else {
          // console.log("wat 3");
          image_url = "";
        }
        
        // console.log("wat v 2");

        try {
          const sv: sqVariation = {
            id: v.id,
            name: v.itemVariationData.name,
            price: [v.itemVariationData.priceMoney.amount, v.itemVariationData.priceMoney.currency],
            image_url: image_url,
          };
  
          // console.log("sv = ", sv);
          
          vs.push(sv);
        } catch (error) {
          console.log("error = ", error);
        }

      });
      
      // console.log("wat 3");

      const x: sqItem = {
        id: item.id,
        name: item.itemData.name,
        variations: vs,
      };

      // console.log("x = ", x);
      items.push(x);
      // console.log(x.variations[0].image_url);
      // console.log(x.variations[0].price);
      // console.log(item);
      // console.log(item.itemData);
    });

    return {
      items: items,
    };

  } catch (error) {
    if (error instanceof ApiError) {
      // @ts-expect-error: unused variables
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errors = error.result;
      // const { statusCode, headers } = error;
    }
  }
}

// getLocations();
