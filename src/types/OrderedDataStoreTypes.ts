export interface OrderedDataStoreContext {
    url: URL,
    base: URL,
    apiKey: string
}

export interface Entry {
    /** The resource path of the request. */
    path: string,
    /** The name of the entry. */
    id: string,
    /** The value of the entry. */
    value: number
}

export interface ListEntries {
    /** The Entries from the specified Scope. */
    entries: Entry[],
    /** A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages. */
    nextPageCursor: string
}

export interface CreateEntryRequest {
    /**
     * The value to set the new entry. If the input value exceeds the maximum value supported by int64, which is 9,223,372,036,854,775,807, the request fails with a 400 Bad Request error.
     */
    value: number
}

export interface UpdateEntryRequest {
    /**
     * The value to set the new entry. If the input value exceeds the maximum value supported by int64, which is 9,223,372,036,854,775,807, the request fails with a 400 Bad Request error.
     */
    value: number
}

export interface ListEntriesParams {
    /** The range of qualifying values of entries to return. */
    filter?: string,
    /** The enumeration direction. The order by default is ascending. Input a desc suffix for descending. */
    order_by?: "desc",
    /** The maximum number of entries to return. The service may return fewer than this value. The default value is `10`. The maximum value is `100`, and any input above `100` is coerced to `100`. */
    max_page_size?: number,
    /** A page token received from a previous `List` call. */
    page_token?: string
}

export interface UpdateDatastoreEntryParams {
    /**
     * The flag to allow the creation of an entry if the entry doesn't exist. See [Allow Missing Flags](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#allow-missing-flags).
     */
    allow_missing?: boolean
}