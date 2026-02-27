import { useMemo } from "react";
import { useVisibleProducts } from "@/features/products/useVisibleProducts";
import { useProductsStore } from "@/store/productsStore";

function ModeBadge({ mode }: { mode: "server" | "client" }) {
  const cls =
    mode === "server"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-indigo-50 text-indigo-700 ring-indigo-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${cls}`}
    >
      {mode.toUpperCase()}
    </span>
  );
}

export default function App() {
  const { items, total, mode, isLoading, isFetching, error } =
    useVisibleProducts();

  // Store state
  const page = useProductsStore((s) => s.page);
  const limit = useProductsStore((s) => s.limit);
  const searchText = useProductsStore((s) => s.searchText);
  const sort = useProductsStore((s) => s.sort);
  const filters = useProductsStore((s) => s.filters);

  // Store actions
  const setPage = useProductsStore((s) => s.setPage);
  const setLimit = useProductsStore((s) => s.setLimit);
  const setSearchText = useProductsStore((s) => s.setSearchText);
  const setSort = useProductsStore((s) => s.setSort);
  const setInStockOnly = useProductsStore((s) => s.setInStockOnly);
  const resetFilters = useProductsStore((s) => s.resetFilters);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Phase 2.5 Test Harness
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Debounced search + dual-mode (server/client) filtering
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ModeBadge mode={mode} />
            <span className="text-sm text-slate-600">
              Total <span className="font-medium text-slate-900">{total}</span>
            </span>
            <span className="text-sm text-slate-600">
              Page <span className="font-medium text-slate-900">{page}</span>
              <span className="text-slate-400"> / </span>
              <span className="font-medium text-slate-900">{totalPages}</span>
            </span>
            <span className="text-sm text-slate-600">
              Limit <span className="font-medium text-slate-900">{limit}</span>
            </span>

            {isFetching ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
                Fetching…
              </span>
            ) : null}
          </div>
        </div>

        {/* Controls card */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="md:col-span-1">
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Search
              </label>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type… (debounced)"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 placeholder:text-slate-400 focus:ring-2"
              />
            </div>

            {/* Limit */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Limit
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 focus:ring-2"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Sort
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 focus:ring-2"
              >
                <option value="relevance">relevance</option>
                <option value="price-asc">price-asc</option>
                <option value="price-desc">price-desc</option>
                <option value="rating-desc">rating-desc</option>
                <option value="discount-desc">discount-desc</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Filters */}
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
              />
              In stock only
            </label>

            <button
              onClick={() => resetFilters()}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.99]"
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Error / Loading */}
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <div className="font-semibold">Error</div>
            <div className="mt-1">{(error as Error).message}</div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="h-4 w-64 rounded bg-slate-200" />
              <div className="h-4 w-56 rounded bg-slate-200" />
            </div>
          </div>
        ) : null}

        {/* Products */}
        {!isLoading && !error ? (
          <>
            {items.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200">
                        ${p.price}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="line-clamp-1 text-sm font-semibold text-slate-900">
                        {p.title}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="rounded-full bg-slate-100 px-2 py-1">
                          {p.category}
                        </span>
                        {p.brand ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1">
                            {p.brand}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm">
                        <div className="text-slate-700">
                          ⭐{" "}
                          <span className="font-medium text-slate-900">
                            {p.rating}
                          </span>
                        </div>
                        <div className="text-slate-700">
                          Stock{" "}
                          <span className="font-medium text-slate-900">
                            {p.stock}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="h-1.5 w-full rounded-full bg-slate-100">
                          {/* a tiny visual “stock bar” just for prettiness */}
                          <div
                            className="h-1.5 rounded-full bg-indigo-500"
                            style={{
                              width: `${Math.min(100, (p.stock / 100) * 100)}%`,
                            }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Discount{" "}
                          <span className="font-medium text-slate-700">
                            {p.discountPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-medium text-slate-900">
                  {(page - 1) * limit + (items.length ? 1 : 0)}
                </span>
                {"–"}
                <span className="font-medium text-slate-900">
                  {(page - 1) * limit + items.length}
                </span>{" "}
                of <span className="font-medium text-slate-900">{total}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={!canPrev}
                  onClick={() => setPage(page - 1)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  Page{" "}
                  <span className="font-semibold text-slate-900">{page}</span> /{" "}
                  <span className="font-semibold text-slate-900">
                    {totalPages}
                  </span>
                </div>

                <button
                  disabled={!canNext}
                  onClick={() => setPage(page + 1)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
