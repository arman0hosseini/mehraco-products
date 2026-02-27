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

  const result = useQuery<ProductsResponse, Error>({
    queryKey: [" ", { page, limit, search: search ?? "" }],
    queryFn: () =>
      fetchProducts({
        limit,
        skip,
        q: search,
      }),
    placeholderData: (previousData) => previousData, // smoother pagination UX
  });

  // console.log(result);
  return result;
}

export function useCategories() {
  return useQuery<string[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30, // 30 min; categories rarely change in a dummy API
  });
}
