
import { Client, Environment, ApiError } from "square";
import test_catalog from '../assets/sample_catalog.json';
import test_images from '../assets/sample_images.json';

// import fs from 'fs';

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
  image_urls: string[];
  variations: sqVariation[];
  price_range: [number, number];
  is_archived: boolean;
  is_deleted: boolean;
}

export interface sqVariation {
  id: string;
  name: string;
  price: [number, string];
  image_urls: string[];
  is_deleted: boolean;
}

export async function fetchSquareCatalog(): Promise<sqCatalog> {

  // const catalog: sqCatalog = await fetchSquareCatalogTest(test_catalog, test_images);

  const catalog: sqCatalog = await fetchSquareCatalog2();

  return catalog;
}

async function fetchSquareCatalogTest(catalog: JSON, image_list: JSON): Promise<sqCatalog> {
  const objects = catalog.objects;

  const items: sqItem[] = [];
  const images = new Map();

  image_list.objects.forEach((item) => {
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

    let image_urls: string[] = [];

    if (item.itemData?.imageIds !== undefined) {
      // const image_ids = item.itemData?.imageIds;
      // console.log(image_id);
      item.itemData?.imageIds.forEach((id) => {
        const image_url = images.get(id);
        if (image_url !== undefined) {
          image_urls.push(image_url);
        }
      });
    }

    item.itemData.variations.forEach((v) => {
      
      // console.log("wat v 1");
      // console.log("v = ", v);
      
      // console.log("ids = ", v.itemVariationData);

      let v_image_urls: string[] = [];

      if (v.itemVariationData?.imageIds !== undefined && v.itemVariationData?.imageIds?.length > 0) {
        // console.log("wat 2");
        // const image_id = v.itemVariationData?.imageIds[0];
        // v_image_url = images.get(image_id);
        v.itemVariationData?.imageIds.forEach((id) => {
          const image_url = images.get(id);
          if (image_url !== undefined) {
            v_image_urls.push(image_url);
          }
        });
      // } else {
        // console.log("wat 3");
        // v_image_url = "";
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
          image_urls: v_image_urls,
          is_deleted: v.isDeleted,
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

    // try {
    //   if (item.itemData.isArchived !== true) {
    //     console.log("archived: ", item.itemData.name);
    //     console.log(item.itemData.isArchived);
    //   } else {
    //     // console.log("not archived: ", item.itemData.name);
    //   }
    //   // console.log("archived = ", item.itemData.isArchived);
    // } catch (error) {
    //   console.log("error: ", item.itemData.name);
    // }
    
    const x: sqItem = {
      id: item.id,
      name: item.itemData.name,
      variations: vs,
      image_urls: image_urls,
      price_range: [price_min, price_max],
      is_archived: item.itemData.isArchived,
      is_deleted: item.isDeleted,
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

async function fetchSquareCatalog2(): Promise<sqCatalog> {
  try {
    // @ts-expect-error: unused variables
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { result: result_catalog, ...httpResponse } = await catalogApi.listCatalog(
      // undefined, 'ITEM,IMAGE'
      undefined, 'ITEM'
      );
    // Get more response info...
    // const { statusCode, headers } = httpResponse;

    const { result: result_images} = await client.catalogApi.searchCatalogObjects({
      objectTypes: [
        'IMAGE'
      ],
      includeDeletedObjects: false,
      includeRelatedObjects: true
    });

    // console.log("writing catalog");
    // const catalog_string = JSON.stringify(result_catalog);
    // console.log(catalog_string);
    
    // console.log("writing images");
    // const images_string = JSON.stringify(result_images);
    // console.log(images_string);
    
    // fs.writeFileSync("./sample_catalog.json", catalog_string);
    // console.log("done writing catalog");

    return fetchSquareCatalogTest(result_catalog, result_images);

  } catch (error) {
    if (error instanceof ApiError) {
      // @ts-expect-error: unused variables
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errors = error.result;
      // const { statusCode, headers } = error;
    }
  }
}
