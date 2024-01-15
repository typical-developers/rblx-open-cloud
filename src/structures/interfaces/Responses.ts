import { DataStoreEntry, DataStoreEntryKey, DataStoreEntryVersion, OrderedDatastoreEntryInfo } from './DataStores';

export interface ListDataStoresResponse {
    /**
     * An array of data stores in the target experience.
     */
    datastores: DataStoreEntry[];
    /**
     * Indicates that there is more data available in the requested result set. See [Cursors](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#cursors).
     */
    nextPageCursor: string;
}

export interface ListEntriesResponse {
    /**
     * The Entries from the specified Scope.
     */
    entries: OrderedDatastoreEntryInfo[];
    /**
     * A token, which can be sent as page_token to retrieve the next page. If this field is omitted, there are no subsequent pages.
     */
    nextPageToken: string;
}

export interface ListEntryVersionResponse {
    /**
     * The versions from the specified entry.
     */
    versions: DataStoreEntryVersion[];
    /**
     * A token, which can be sent as page_token to retrieve the next page. If this field is omitted, there are no subsequent pages.
     */
    nextPageCursor: string;
}

export interface ListDataStoreEntries {
    /**
     * The keys inside of the datastore.
     */
    keys: DataStoreEntryKey[];
    /**
     * A token, which can be sent as page_token to retrieve the next page. If this field is omitted, there are no subsequent pages.
     */
    nextPageCursor: string | undefined;
}
