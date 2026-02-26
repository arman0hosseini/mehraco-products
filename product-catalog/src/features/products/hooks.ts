import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "./api";
import type { ProductsResponse } from "./types";

type UseProductsArgs = {
  page: number; // 1-based for UI
  limit: number;
  search?: string;
};

export function useProducts({ page, limit, search }: UseProductsArgs) {
  const skip = (page - 1) * limit;

  // Query keys must include every variable that changes the result
  // so caching behaves correctly. :contentReference[oaicite:5]{index=5}
  return useQuery<ProductsResponse, Error>({
    queryKey: [" ", { page, limit, search: search ?? "" }],
    queryFn: () =>
      fetchProducts({
        limit,
        skip,
        q: search,
      }),
    placeholderData: (previousData) => previousData, // smoother pagination UX
  });
}

export function useCategories() {
  return useQuery<string[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30, // 30 min; categories rarely change in a dummy API
  });
}
