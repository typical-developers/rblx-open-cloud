import { Datastore, EntryVersion, EntryKeys } from "./default"

export interface ListDatastores {
    /**
     * An array of data stores in the target experience.
     */
    datastores: Datastore[],
    /**
     * Indicates that there is more data available in the requested result set. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    nextPageCursor: string
}

export interface ListDatastoresParams {
    /**
     * Provide to request the next set of data. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    cursor?: string,
    /**
     * The maximum number of items to return. Each call only reads one partition so it can return fewer than the given value when running out of objectives on one partition.
     */
    limit?: number,
    /**
     * Provide to return only data stores with this prefix.
     */
    prefix?: string
}

export interface ListEntryVersion {
    /**
     * An array of entry versions for the target data store in the target experience.
     */
    versions: EntryVersion[],
    /**
     * Indicates that there is more data available in the requested result set. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    nextPageCursor: string
}

export interface ListEntryKeys {
    /**
     * An array of entry keys in the target experience.
     */
    keys: EntryKeys[],
    /**
     * Indicates that there is more data available in the requested result set. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    nextPageCursor: string
}

export interface ListEntryKeysParams {
    /**
     * The value is `global` by default. See [Scopes](https://create.roblox.com/docs/cloud-services/datastores#scopes).
     */
    scope?: string,
    /**
     * Set to true to return keys from all scopes.
     */
    allScopes?: boolean,
    /**
     * Provide to return only keys with this prefix.
     */
    prefix?: string,
    /**
     * Provide to request the next set of data. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    cursor?: string,
    /**
     * The maximum number of items to return. Each call only reads one partition so it can return fewer than the given value when running out of objectives on one partition.
     */
    limit?: number
}
