import { httpGet } from "@/api/http";
import type { Product, ProductsResponse } from "./types";

export type ProductsQueryParams = {
  limit: number;
  skip: number;
  q?: string; // search text
};

export function fetchProducts(params: ProductsQueryParams) {
  const q = params.q?.trim();

  if (q && q.length > 0) {
    return httpGet<ProductsResponse>("/products/search", {
      q,
      limit: params.limit,
      skip: params.skip,
    });
  }

  return httpGet<ProductsResponse>("/products", {
    limit: params.limit,
    skip: params.skip,
  });
}

// Optional now, useful later (filters UI):
export function fetchCategories() {
  return httpGet<string[]>("/products/categories");
}

/**
 * Fetches ALL products by paging until we have everything.
 * Needed for client-side filters/sort when the server can't combine them.
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const pageSize = 100; // bigger page size = fewer requests
  let skip = 0;

  const first = await fetchProducts({ limit: pageSize, skip });
  let all: Product[] = [...first.products];
  const total = first.total;

  skip += pageSize;

  while (all.length < total) {
    const next = await fetchProducts({ limit: pageSize, skip });
    all = all.concat(next.products);
    skip += pageSize;
  }

  return all;
}
