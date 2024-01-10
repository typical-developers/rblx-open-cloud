export interface Datastore {
    /** The name of your data store. */
    name: string,
    /** The timestamp of when the data store was created in the ISO time format. */
    createdTime: string
}

export interface EntryVersion {
    /** The version name of the qualifying entry. */
    version: string,
    /** Indicates whether the entry has been deleted. */
    deleted: boolean,
    /** The length of the content. */
    contentLength: number,
    /** The timestamp of when the version was created in the ISO time format. */
    createdTime: string,
    /** The timestamp of when the data store was created in the ISO time format. */
    objectCreatedTime: string
}

export interface EntryKeys {
    /**
     * If allScope is provided, a scope will be returned. See (Scopes)[https://create.roblox.com/docs/cloud-services/datastores#scopes].
     */
    scope?: string,
    /**
     * The entry key.
     */
    key: string
}
