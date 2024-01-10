export interface DatastoreContext {
    url: URL,
    base: URL,
    key: string,
    attributes: object,
    userIds: number[]
}

export interface GetEntryParams {
    /**
     * The value is `global` by default. See (Scopes)[https://create.roblox.com/docs/cloud-services/datastores#scopes].
     */
    scope?: string
}

export interface EntryVersionParams {
    /**
     * The value is `global` by default. See (Scopes)[https://create.roblox.com/docs/cloud-services/datastores#scopes].
     */
    scope?: string
}

export interface EntryVersionsParams {
    /**
     * Provide to request the next set of data (see [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors)).
     */
    cursor?: string,
    /**
     * Provide to not include versions earlier than this timestamp.
     */
    startTime?: string,
    /**
     * Provide to not include versions later than this timestamp.
     */
    endTime?: string,
    /**
     * Either `Ascending` (earlier versions first) or `Descending` (later versions first).
     */
    sortOrder?: "Ascending" | "Descending",
    /**
     * The maximum number of items to return. Each call only reads one partition so it can return fewer than the given value when running out of objectives on one partition.
     */
    limit?: number
}