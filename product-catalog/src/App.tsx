import { useProducts } from "@/features/products/hooks";

export default function App() {
  const { data, isLoading, error } = useProducts({
    page: 1,
    limit: 12,
    search: "",
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-semibold">Product Catalog</h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-xl border bg-white p-6">
          {isLoading && <p>Loading…</p>}
          {error && <p className="text-red-600">Error: {error.message}</p>}

          {data && (
            <>
              <p className="text-sm text-gray-600">
                Total: {data.total} — Showing: {data.products.length}
              </p>

              <ul className="mt-4 list-disc pl-6">
                {data.products.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    {p.title} — ${p.price}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
