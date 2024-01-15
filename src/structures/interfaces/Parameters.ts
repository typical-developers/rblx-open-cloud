export interface BaseParamters {
    /**
     * The value is `global` by default. See [Scopes](https://create.roblox.com/docs/cloud-services/datastores#scopes).
     */
    scope?: string;
}

export interface GetDataStore {
    /**
     * The value is `global` by default. See [Scopes](https://create.roblox.com/docs/cloud-services/datastores#scopes).
     */
    scope?: string;
}

export interface ListDataStore {
    /**
     * Provide to request the next set of data. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    cursor?: string;
    /**
     * The maximum number of items to return. Each call only reads one partition so it can return fewer than the given value when running out of objectives on one partition.
     */
    limit?: number;
    /**
     * Provide to return only data stores with this prefix.
     */
    prefix?: string;
}

export interface GetOrderedDataStore {
    /**
     * The maximum number of entries to return. The service may return fewer than this value. The default value is `10`. The maximum value is `100`, and any input above 100 is coerced to `100`.
     */
    max_page_size?: number;
    /**
     * A page token received from a previous `List` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `List` must match the call providing the page token.
     */
    page_token?: string;
    /**
     * The enumeration direction. The order by default is ascending. Input a `desc` suffix for descending.
     */
    order_by?: 'desc';
    /**
     * The range of qualifying values of entries to return. See [Filters](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#filters).
     */
    filter?: string;
}

export interface UpdateOrderedDataStore {
    /**
     * The flag to allow the creation of an entry if the entry doesn't exist. See [Allow Missing Flags](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#allow-missing-flags).
     */
    allow_missing?: boolean;
}

export interface UpdateDataStore {
    /**
     * Provide to update only if the current version matches this.
     */
    matchVerson?: string;
    /**
     * Create the entry only if it does not exist.
     */
    exclusiveCreate?: boolean;
}

export interface ListEntryVersions {
    /**
     * Provide to request the next set of data (see [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors)).
     */
    cursor?: string;
    /**
     * Provide to not include versions earlier than this timestamp.
     */
    startTime?: string;
    /**
     * Provide to not include versions later than this timestamp.
     */
    endTime?: string;
    /**
     * Either `Ascending` (earlier versions first) or `Descending` (later versions first).
     */
    sortOrder?: 'Ascending' | 'Descending';
    /**
     * The maximum number of items to return. Each call only reads one partition so it can return fewer than the given value when running out of objectives on one partition.
     */
    limit?: number;
}
