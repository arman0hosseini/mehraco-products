import { create } from "zustand";

/**
 * Sort options for the UI.
 * You can change these labels later to match the dropdown text.
 */
export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "discount-desc"
  | "rating-desc";

/**
 * Filters state that belongs to the client (UI).
 * Server may not support all filters, so we keep them here and apply later.
 */
export type ProductFilters = {
  selectedCategories: string[];
  selectedBrands: string[];
  priceMin: number | null;
  priceMax: number | null;
  inStockOnly: boolean;
};

export type ProductsUiState = {
  // Search + sort
  searchText: string;
  sort: SortOption;

  // Filters
  filters: ProductFilters;

  // Pagination
  page: number; // 1-based
  limit: number;

  // Actions
  setSearchText: (value: string) => void;
  setSort: (value: SortOption) => void;

  toggleCategory: (category: string) => void;
  toggleBrand: (brand: string) => void;
  setPriceMin: (value: number | null) => void;
  setPriceMax: (value: number | null) => void;
  setInStockOnly: (value: boolean) => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  resetFilters: () => void;
};

const defaultFilters: ProductFilters = {
  selectedCategories: [],
  selectedBrands: [],
  priceMin: null,
  priceMax: null,
  inStockOnly: false,
};

export const useProductsStore = create<ProductsUiState>((set) => ({
  // Initial state
  searchText: "",
  sort: "relevance",
  filters: defaultFilters,
  page: 1,
  limit: 12,

  // Actions
  setSearchText: (value) =>
    set(() => ({
      searchText: value,
      page: 1, // important: changing search resets pagination
    })),

  setSort: (value) =>
    set(() => ({
      sort: value,
      page: 1, // changing sort resets pagination
    })),

  toggleCategory: (category) =>
    set((state) => {
      const exists = state.filters.selectedCategories.includes(category);
      const nextCategories = exists
        ? state.filters.selectedCategories.filter((c) => c !== category)
        : [...state.filters.selectedCategories, category];

      return {
        filters: { ...state.filters, selectedCategories: nextCategories },
        page: 1, // filter change resets pagination
      };
    }),

  toggleBrand: (brand) =>
    set((state) => {
      const exists = state.filters.selectedBrands.includes(brand);
      const nextBrands = exists
        ? state.filters.selectedBrands.filter((b) => b !== brand)
        : [...state.filters.selectedBrands, brand];

      return {
        filters: { ...state.filters, selectedBrands: nextBrands },
        page: 1,
      };
    }),

  setPriceMin: (value) =>
    set((state) => ({
      filters: { ...state.filters, priceMin: value },
      page: 1,
    })),

  setPriceMax: (value) =>
    set((state) => ({
      filters: { ...state.filters, priceMax: value },
      page: 1,
    })),

  setInStockOnly: (value) =>
    set((state) => ({
      filters: { ...state.filters, inStockOnly: value },
      page: 1,
    })),

  setPage: (page) => set(() => ({ page })),

  setLimit: (limit) =>
    set(() => ({
      limit,
      page: 1, // changing page size resets to first page
    })),

  resetFilters: () =>
    set(() => ({
      filters: defaultFilters,
      page: 1,
    })),
}));
