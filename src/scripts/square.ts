
import { Client, Environment, ApiError } from "square";
// import test_catalog from '../assets/sample_catalog.json';
// import test_images from '../assets/sample_images.json';
// import test_categories from '../assets/sample_categories.json';
// import test_subcategories from '../assets/sample_subcategories.json';

// import fs from 'fs';

const client = new Client({
  accessToken: import.meta.env.SQUARE_ACCESS_TOKEN,
  // environment: Environment.Sandbox,
  environment: Environment.Production,
});

const { catalogApi } = client;

export interface sqCatalog {
  // items: sqItem[];
  items: Map<string, sqItem>;
  categories: Map<string, string>;
}

export interface sqItem {
  id: string;
  name: string;
  category: string;
  category_id_main: string;
  // category_ids: string[];
  category_ids: Map<string,string>;
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

export async function fetchSquareCatalog(): Promise<sqCatalog> {

  // const catalog: sqCatalog = await fetchSquareCatalogTest(test_catalog, test_images, test_categories);

  const catalog: sqCatalog = await fetchSquareCatalog2();

  return catalog;
}

async function fetchSquareCatalogTest(
  catalog: Object, 
  image_list: Object, 
  category_list: Object,
  category_items: Map<string, string[]>, // category_id, [matching item ids]
  ): Promise<sqCatalog> {

  // const items: sqItem[] = [];
  const items: Map<string, sqItem> = new Map();
  const images = new Map();
  const categories: Map<string, string> = new Map();

  console.log("sorting images");  
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

  console.log("sorting categories");  
  category_list.objects.forEach((item) => {
    if (item.type !== 'CATEGORY' || item.is_deleted) {
      return;
    }
    if (item.categoryData === undefined) {
      console.log(item);
      throw new Error("category has no categoryData");
    }
    categories.set(item.id, item.categoryData.name);
  });

  // console.log("categories:");  
  // categories.forEach((v, k) => {
  //   console.log(k, " = ", v);
  // });
  
  console.log("sorting items");

  // catalog.items.forEach((item) => {
  //   // if (item.type !== 'ITEM' || item.is_deleted || item.is_archived) {
  //   //   return;
  //   // }
  //   console.log("item = ", item.id);    
  // });
  
  catalog.items.forEach((item) => {
    try {
      if (item.type !== 'ITEM' || item.is_deleted || item.is_archived) {
        return;
      }
      console.log("item.id = ", item.id); 

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

      const category_ids = new Map();
      
      const x: sqItem = {
        id: item.id,
        name: item.itemData.name,
        category: categories.get(item.itemData.categoryId),
        category_id_main: item.itemData.categoryId,
        category_ids: category_ids,
        variations: vs,
        image_urls: image_urls,
        price_range: [price_min, price_max],
        is_archived: item.itemData.isArchived,
        is_deleted: item.isDeleted,
        // tags: tags,
        description: description,
      };

      if (price_max !== 0) {
        // items.push(x);
        items.set(item.id, x);
      }
            
    } catch (error) {
        console.log("item error = ", item.id, ": ", error);        
    }
  });

  const empty_categories: Set<string> = new Set(categories.keys());

  console.log("setting sub-categories");
  category_items.forEach((cat_items, cat_id) => {
    cat_items.forEach((item_id) => {
      const item = items.get(item_id);
      const category = categories.get(cat_id);
      if (item !== undefined && category !== undefined) {
        item.category_ids.set(cat_id, category)
        empty_categories.delete(cat_id);
      }
    });
  });

  empty_categories.forEach((cat_id) => {
    categories.delete(cat_id);
  });

  return {
    items: items,
    categories: categories,
  };
}

async function fetchSquareCatalog2(): Promise<sqCatalog> {
  try {
    // @ts-expect-error: unused variables
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { result: result_catalog, ...httpResponse } = await catalogApi.listCatalog(
    //   // undefined, 'ITEM,IMAGE'
    //   undefined, 'ITEM'
    //   );

    console.log("fetching catalog...");
    const { result: result_catalog } = await client.catalogApi.searchCatalogItems({
      productTypes: [
        'REGULAR'
      ],
      archivedState: 'ARCHIVED_STATE_NOT_ARCHIVED'
    });

    // Get more response info...
    // const { statusCode, headers } = httpResponse;

    console.log("fetching images...");
    const { result: result_images} = await client.catalogApi.searchCatalogObjects({
      objectTypes: [
        'IMAGE'
      ],
      includeDeletedObjects: false,
      includeRelatedObjects: true
    });

    console.log("fetching categories...");
    const { result: result_categories} = await client.catalogApi.searchCatalogObjects({
      objectTypes: [
        'CATEGORY'
      ],
      includeDeletedObjects: false,
      includeRelatedObjects: true
    });
    
    const category_items: Map<string, string[]> = new Map();

    console.log("fetching sub-categories...");
    for (const category of result_categories.objects) {
      try {        
        const { result } = await client.catalogApi.searchCatalogItems({
          categoryIds: [
            category.id
          ],
          productTypes: [
            'REGULAR'
          ],
          archivedState: 'ARCHIVED_STATE_NOT_ARCHIVED'
        });

        const items: string[] = [];
        // const items = result.items?.map((item) => item.id );
        
        result.items?.map((item) => items.push(item.id));

        category_items.set(category.id, items);

      } catch (error) {
        console.log("fetching category items error: ", error);
      }
    }

    // const x = category_items.get("7M6I325XNGOCLM3KTBUNY7UD");
    // console.log("x = ", x);

    // const result_categories = { objects: [] };

    // console.log("writing catalog");
    // const catalog_string = JSON.stringify(result_catalog);
    // console.log(catalog_string);
    
    // console.log("writing images");
    // const images_string = JSON.stringify(result_images);
    // console.log(images_string);
    
    // fs.writeFileSync("./sample_catalog.json", catalog_string);
    // console.log("done writing catalog");

    const catalog = fetchSquareCatalogTest(
      result_catalog, 
      result_images, 
      result_categories,
      category_items,
      );

    return catalog;
  } catch (error) {
    if (error instanceof ApiError) {
      // @ts-expect-error: unused variables
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errors = error.result;
      // const { statusCode, headers } = error;
    }
  }
}
