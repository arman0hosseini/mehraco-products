const BASE_URL = "https://dummyjson.com";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildQuery(params?: QueryParams) {
  if (!params) return "";
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    sp.set(key, String(value));
  });

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export async function httpGet<T>(
  path: string,
  params?: QueryParams,
): Promise<T> {
  const url = `${BASE_URL}${path}${buildQuery(params)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`,
    );
  }
  const result = (await res.json()) as T;
  // console.log(result);
  return result;
}
