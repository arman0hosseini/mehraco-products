import type { Product } from "./types";
import type { ProductFilters, SortOption } from "@/store/productsStore";

type ApplyResult = {
  items: Product[];
  total: number;
};

export function applyFiltersAndSort(
  products: Product[],
  filters: ProductFilters,
  sort: SortOption,
): ApplyResult {
  // 1) Start with the original list (we will not mutate it)
  let result = products;

  // 2) Filter by categories (if any are selected)
  if (filters.selectedCategories.length > 0) {
    const selected = new Set(filters.selectedCategories);
    result = result.filter((p) => selected.has(p.category));
  }

  // 3) Filter by brands (if any are selected)
  if (filters.selectedBrands.length > 0) {
    const selected = new Set(filters.selectedBrands);
    result = result.filter((p) => p.brand && selected.has(p.brand));
  }

  // 4) Filter by price range (min / max)
  if (filters.priceMin !== null) {
    result = result.filter((p) => p.price >= filters.priceMin!);
  }

  if (filters.priceMax !== null) {
    result = result.filter((p) => p.price <= filters.priceMax!);
  }

  // 5) Filter by inStockOnly
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }

  // 6) Sorting (copy before sorting because sort() mutates the array)
  const sorted = [...result];

  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;

    case "discount-desc":
      sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
      break;

    case "rating-desc":
      sorted.sort((a, b) => b.rating - a.rating);
      break;

    case "relevance":
    default:
      // Do nothing: keep the current order
      break;
  }

  return { items: sorted, total: sorted.length };
}
