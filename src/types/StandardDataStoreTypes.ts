export interface DatastoreContext {
    url: URL;
    apiKey: string;
    attributes: object;
    userIds: number[];
}

export interface Datastore {
    /**
     * The name of your data store.
     */
    name: string;
    /**
     *  The timestamp of when the data store was created in the ISO time format.
     */
    createdTime: string;
}

export interface EntryVersion {
    /**
     *  The version name of the qualifying entry.
     */
    version: string;
    /**
     *  Indicates whether the entry has been deleted.
     */
    deleted: boolean;
    /**
     *  The length of the content.
     */
    contentLength: number;
    /**
     * The timestamp of when the version was created in the ISO time format.
     */
    createdTime: string;
    /**
     * The timestamp of when the data store was created in the ISO time format.
     */
    objectCreatedTime: string;
}

export interface EntryKey {
    /**
     * If allScope is provided, this will be returned.
     */
    scope?: string;
    /**
     * The key for the entry.
     */
    key: string;
}

export interface ListDatastores {
    /**
     * An array of data stores in the target experience.
     */
    datastores: Datastore[];
    /**
     * Indicates that there is more data available in the requested result set. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    nextPageCursor: string;
}

export interface ListEntries {
    /**
     * An array of entry keys within the target data store.
     */
    keys: EntryKey[];
    /**
     * Indicates that there is more data available in the requested result set. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    nextPageCursor: string;
}

export interface ListEntryVersions {
    /**
     * An array of entry versions for the target data store in the target experience.
     */
    versions: EntryVersion[];
    /**
     * Indicates that there is more data available in the requested result set. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    nextPageCursor: string;
}

export interface ListDatastoresParams {
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

export interface ListEntriesParams {
    /**
     * The value is `global` by default. See [Scopes](https://create.roblox.com/docs/cloud-services/datastores#scopes).
     */
    scope?: string;
    /**
     * Set to true to return keys from all scopes.
     */
    allScopes?: boolean;
    /**
     * Provide to return only keys with this prefix.
     */
    prefix?: string;
    /**
     * Provide to request the next set of data. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    cursor?: string;
    /**
     * The maximum number of items to return. Each call only reads one partition so it can return fewer than the given value when running out of objectives on one partition.
     */
    limit?: number;
}

export interface GetEntryParams {
    /**
     * The value is `global` by default. See (Scopes)[https://create.roblox.com/docs/cloud-services/datastores#scopes].
     */
    scope?: string;
}

export interface EntryVersionParams {
    /**
     * The value is `global` by default. See (Scopes)[https://create.roblox.com/docs/cloud-services/datastores#scopes].
     */
    scope?: string;
}

export interface EntryVersionsParams {
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
