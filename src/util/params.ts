/**
 * @param url The URL you want to add params to.
 * @param params The params you want to add to the URL.
 */
export function addParams<T>(url: URL, params: T) {
    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
    }
}
