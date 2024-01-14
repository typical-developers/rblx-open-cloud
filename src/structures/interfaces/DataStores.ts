export interface DataStoreEntry {
    /**
     * The name of your data store.
     */
    name: string;
    /**
     * The timestamp of when the data store was created in the ISO time format.
     */
    createdTime: string;
}

export interface DataStoreEntryVersion {
    /**
     * The version name of the qualifying entry.
     */
    version: string;
    /**
     * Indicates whether the entry has been deleted.
     */
    deleted: boolean;
    /**
     * The length of the content.
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

export interface DataStoreKeyInfo {
    /**
     * The time at which the entry was created.
     */
    createdTime: string;
    /**
     * The time at which this particular version was created.
     */
    updatedTime: string;
    /**
     * The version of the returned entry.
     */
    version: string;
    /**
     * Attributes associated with the returned entry. Serialized JSON map object.
     */
    attributes: object;
    /**
     * Comma-separated list of Roblox user IDs tagged with the entry.
     */
    userIds: number[] | never[];
}

export interface OrderedDatastoreEntryInfo {
    /**
     * The resource path of the request.
     */
    path: string;
    /**
     * The name of the entry
     */
    id: string;
    /**
     * The value of the entry.
     */
    value: number;
}

export interface DataStoreEntryKey {
    /**
     * Return if allScopes is defined in parameters.
     */
    scope?: string;
    /**
     * The key in the datastore.
     */
    key: string;
}
