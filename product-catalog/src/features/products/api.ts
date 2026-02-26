import { httpGet } from "@/api/http";
import type { ProductsResponse } from "./types";

export type ProductsQueryParams = {
  limit: number;
  skip: number;
  q?: string; // search text
};

export function fetchProducts(params: ProductsQueryParams) {
  // If searching, use /products/search endpoint
  // Otherwise use /products
  if (params.q && params.q.trim().length > 0) {
    return httpGet<ProductsResponse>("/products/search", {
      q: params.q.trim(),
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
