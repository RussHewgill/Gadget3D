import { 
  Client, 
  Environment, 
  ApiError, 
  type CatalogObject, 
  type SearchCatalogObjectsRequest, 
  // type SearchCatalogObjectsResponse 
} from "square";

const client = new Client({
  accessToken: import.meta.env.SQUARE_ACCESS_TOKEN,
  // environment: Environment.Sandbox,
  environment: Environment.Production,
});

export interface sqCatalog {
  items: Map<string, sqItem>;
  categories: Map<string, sqCategory>; // id -> category
}

export interface sqItem {
  id: string;
  name: string;
  category: string;
  category_id_main: string;
  // category_ids: string[];
  category_ids: Map<string,string>; // id -> name
  image_urls: string[];
  variations: sqVariation[];
  price_range: [number, number];
  is_archived: boolean;
  is_deleted: boolean;
  // tags: string[];
  description: string;
}

export interface sqVariation {
  id: string;
  name: string;
  price: [number, string];
  image_urls: string[];
  is_deleted: boolean;
}

export interface sqCategory {
  id: string;
  name: string;
  image_url?: string;
  is_deleted: boolean;
  // parent: ;
}

function parseCatalog(
  catalog: CatalogObject[],
): sqCatalog {

  const items = new Map<string, sqItem>();
  const images = new Map(); // id -> url
  const categories: Map<string, sqCategory> = new Map();

  console.log("sorting images");
  catalog.forEach((item) => {
    if (item.type !== 'IMAGE' || item.is_deleted) {
      return;
    }
    if (item.imageData === undefined) {
      console.log(item);
      
      throw new Error("image has no imageData");
    }
    images.set(item.id, item.imageData.url);
  });
  console.log(images.size, " images");

  console.log("sorting items");
  // console.log(catalog.length);
  catalog.forEach((item) => {
    try {
      if (item.type !== 'ITEM' 
        || item.isDeleted 
        || item.itemData?.isArchived
        // || item.itemData.avai
      ) {
        return;
      }

      if (item.itemData?.availableOnline !== undefined
        || item.itemData?.availableElectronically !== undefined
        ) {
          console.log("item name = ", item.itemData?.name);
          console.log("item.itemData.availableOnline = ", item.itemData?.availableOnline);
          console.log("item.itemData?.availableElectronically = ", item.itemData?.availableElectronically);
        
        }

      let price_min = 10000000;
      let price_max = 0;

      const vs: sqVariation[] = [];

      if (item.itemData === undefined) {
        console.log("Item has no ItemData");
        throw new Error("Item has no ItemData");
      }

      if (item.itemData.variations === undefined || item.itemData.variations === null) {
        console.log("item = ", item);
        throw new Error("item has no variations");
      }
      
      let description = "";
      if (item.itemData.description !== undefined) {
        description = item.itemData.description;
      }

      let image_urls: string[] = [];

      if (item.itemData?.imageIds !== undefined) {
        item.itemData?.imageIds.forEach((id) => {
          const image_url = images.get(id);
          if (image_url !== undefined) {
            image_urls.push(image_url);
          }
        });
      }

      item.itemData.variations.forEach((v) => {
        if (v.itemVariationData.priceMoney?.currency !== undefined) {

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
        }
      });

      if (item.itemData.reportingCategory === undefined) {
        console.log("item without reporting category = ", item.itemData.name);
        return;
      }

      let reporting_category = categories.get(item.itemData.reportingCategory);      
      const category_ids = new Map();

      item.itemData.categories.forEach((c) => {
        category_ids.set(c.id, c.name);
      });
      
      const x: sqItem = {
        id: item.id,
        name: item.itemData.name,
        category: reporting_category ?? "",
        // category: categories.get(item.itemData.categoryId),
        // category_id_main: item.itemData.categoryId,
        category_ids: category_ids,
        variations: vs,
        image_urls: image_urls,
        price_range: [price_min, price_max],
        is_archived: item.itemData.isArchived,
        is_deleted: item.isDeleted,
        // tags: tags,
        description: description,
      };

      // 

      if (price_max !== 0) {
        // items.push(x);
        items.set(item.id, x);
      }

    } catch (error) {
      console.log("item error = ", item.id, ": ", error);    
    }
  });

  console.log("sorting categories");
  catalog.forEach((item) => {
    try {
      if (item.type !== 'CATEGORY' || item.is_deleted) {
        return;
      }

      if (item.categoryData === undefined) {
        console.log("category has no categoryData");
        throw new Error("category has no categoryData");
      }

      let category: sqCategory = {
        id: item.id,
        name: item.categoryData.name,
        image_url: item.categoryData.imageId !== undefined ? images.get(item.categoryData.imageId) : undefined,
        is_deleted: item.isDeleted,
        // parent: item.categoryData.parentCategory,
      };

      categories.set(item.id, category);
    } catch (error) {
      console.log("category error = ", item.id, ": ", error);    
    }
  });
  console.log("categories.size = ", categories.size);

  for (const [categoryId, category] of categories) {
    let hasItems = false;

    for (const item of items.values()) {
      if (item.category_id_main == categoryId || item.category_ids.has(categoryId)) {
        hasItems = true;
        break;
      }
    }

    if (!hasItems) {
      categories.delete(categoryId);
    }
  }

  return {
    items: items,
    categories: categories,
  };
}

export async function fetchSquareCatalog(): Promise<sqCatalog> {
  try {
    console.log("fetching catalog...");
 
    const { result: result_catalog } = await client.catalogApi.searchCatalogObjects({
      objectTypes: [
        'ITEM',
        'IMAGE',
        'CATEGORY'
      ],
      includeDeletedObjects: false,
      includeRelatedObjects: false,
      includeCategoryPathToRoot: true
    });

    return parseCatalog(
      result_catalog?.objects ?? []
      );
  } catch (error) {
    if (error instanceof ApiError) {
      console.log("fetch catalog error?");

      // @ts-expect-error: unused variables
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errors = error.result;
      // const { statusCode, headers } = error;
    }
  }
}