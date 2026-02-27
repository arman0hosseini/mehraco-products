import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  useProductsStore,
  type ProductFilters,
  type SortOption,
} from "@/store/productsStore";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProducts } from "./hooks";
import { fetchAllProducts } from "./api";
import { applyFiltersAndSort } from "./applyFiltersAndSort";

function hasAdvancedFilteringOrSorting(
  filters: ProductFilters,
  sort: SortOption,
) {
  const filtersActive =
    filters.selectedCategories.length > 0 ||
    filters.selectedBrands.length > 0 ||
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.inStockOnly;

  const sortActive = sort !== "relevance";

  return filtersActive || sortActive;
}

export function useVisibleProducts() {
  // 1) Read UI state from store
  const page = useProductsStore((s) => s.page);
  const limit = useProductsStore((s) => s.limit);
  const searchText = useProductsStore((s) => s.searchText);
  const filters = useProductsStore((s) => s.filters);
  const sort = useProductsStore((s) => s.sort);

  // 2) Debounce search so we don't refetch every keystroke
  const debouncedSearch = useDebouncedValue(searchText, 400);

  // 3) Decide strategy
  const advanced = hasAdvancedFilteringOrSorting(filters, sort);

  // 4A) Normal path: server-side pagination + search (fast)
  const serverQuery = useProducts({
    page,
    limit,
    search: debouncedSearch,
  });

  // 4B) Advanced path: fetch big bag once, then filter/sort/paginate client-side
  const allQuery = useQuery({
    queryKey: ["all-products"],
    queryFn: fetchAllProducts,
    enabled: advanced,
    staleTime: 60_000,
  });

  // 5) Compute the visible list
  const computed = useMemo(() => {
    if (!advanced) {
      return {
        items: serverQuery.data?.products ?? [],
        total: serverQuery.data?.total ?? 0,
        mode: "server" as const,
      };
    }

    const all = allQuery.data ?? [];
    const applied = applyFiltersAndSort(all, filters, sort);

    const start = (page - 1) * limit;
    const end = start + limit;
    const pageItems = applied.items.slice(start, end);

    return {
      items: pageItems,
      total: applied.total,
      mode: "client" as const,
    };
  }, [advanced, page, limit, filters, sort, serverQuery.data, allQuery.data]);

  // 6) Unify loading/error for the UI
  const isLoading = advanced ? allQuery.isLoading : serverQuery.isLoading;
  const isFetching = advanced ? allQuery.isFetching : serverQuery.isFetching;
  const error = advanced ? allQuery.error : serverQuery.error;

  return {
    ...computed,
    isLoading,
    isFetching,
    error,
  };
}
