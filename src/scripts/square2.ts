import { Client, Environment, ApiError } from "square";

const client = new Client({
  accessToken: import.meta.env.SQUARE_ACCESS_TOKEN,
  // environment: Environment.Sandbox,
  environment: Environment.Production,
});

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

export async function getCatalog(): Promise<sqCatalog> {
  try {
    console.log("fetching catalog...");
    const { result: result_catalog } = await client.catalogApi.searchCatalogItems({
      productTypes: [
        'REGULAR'
      ],
      archivedState: 'ARCHIVED_STATE_NOT_ARCHIVED'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      // @ts-expect-error: unused variables
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const errors = error.result;
      // const { statusCode, headers } = error;
    }
  }
}