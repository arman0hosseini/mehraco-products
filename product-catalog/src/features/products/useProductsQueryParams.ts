import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProductsStore } from "@/store/productsStore";

/**
 * Reads the store and returns values used to fetch products.
 * This keeps components clean.
 */
export function useProductsQueryParams() {
  const page = useProductsStore((s) => s.page);
  const limit = useProductsStore((s) => s.limit);
  const searchText = useProductsStore((s) => s.searchText);

  const debouncedSearch = useDebouncedValue(searchText, 400);

  return {
    page: page,
    limit: limit,
    search: debouncedSearch,
  };
}
