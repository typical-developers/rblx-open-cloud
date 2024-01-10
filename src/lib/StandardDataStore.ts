import { DatastoreContext, EntryVersionParams, EntryVersionsParams, ListEntryVersions, ListDatastoresParams, ListDatastores, ListEntriesParams, ListEntries, GetEntryParams } from "../types/StandardDataStoreTypes";
import { DeepPartial } from "../types/global";
import { baseApiUrl } from "../util/constants";
import { addParams } from '../util/params';
import { deepReplace } from "../util/replace";
import { createHash } from 'crypto';

class DatastoreEntry<T> {
    public readonly datastore: T;
    public readonly context: DatastoreContext;

    /**
     * @param context Context passed through when the datastore was requested
     * @param data The datastore contents
     */
    constructor(context: DatastoreContext, data: T) {
        this.context = context;
        this.datastore = data;
    }

    /**
     * Sets the value, metadata and user IDs associated with an entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#POST-v1-universes-_universeId_-standard-datastores-datastore-entries-entry
     * @param newData New data to replace current data with. Will automatically replace new data.
     */
    public async set(newData: DeepPartial<T>) {
        const data = deepReplace<T>(this.datastore, newData);
        const hash = createHash('md5').update(JSON.stringify(data)).digest('base64');

        const response = await fetch(this.context.url, {
            method: "POST",
            headers: {
                'x-api-key': this.context.apiKey,
                'content-md5': hash,
                'content-type': 'application/json',
                'roblox-entry-userids': JSON.stringify(this.context.userIds),
                'roblox-entry-attributes': JSON.stringify(this.context.attributes)
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            return undefined;
        }

        return new DatastoreEntry(this.context, data);
    }

    /**
     * Marks the entry as deleted by creating a tombstone version. Entries are deleted permanently after 30 days.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#DELETE-v1-universes-_universeId_-standard-datastores-datastore-entries-entry
     * @returns Whether or not the entry was successfully marked as deleted.
     */
    public async delete() {
        const response = await fetch(this.context.url, {
            method: "DELETE",
            headers: { 'x-api-key': this.context.apiKey }
        });

        if (!response.ok) {
            return false;
        }

        return true;
    }

    /**
     * Returns the value and metadata of a specific version of an entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores-datastore-entries-entry-versions-version
     * @param versionId The version to inspect.
     */
    public async version(versionId: string, optionalParams?: EntryVersionParams) {
        const url = new URL(`${this.context.url.pathname}/versions/version${this.context.url.search}`, this.context.base);

        url.searchParams.set('versionId', versionId);

        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.context.apiKey } });
        if (!response.ok) {
            return undefined;
        }

        const json: T = await response.json();
        return new DatastoreEntry<T>(this.context, json);
    }

    /**
     * Returns a list of data stores belonging to an experience.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores-datastore-entries-entry-versions
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async versions(optionalParams?: EntryVersionsParams) {
        const url = new URL(`${this.context.url.pathname}/versions${this.context.url.search}`, this.context.base);
        
        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.context.apiKey } });
        if (!response.ok) {
            console.log(`${response.status} - Unable to fetch entry versions.`);
            return undefined;
        }

        const json: ListEntryVersions = await response.json();
        return json;
    }
}

export class StandardDataStore {
    /** Your Open Cloud API key. */
    public readonly apiKey: string;
    /** The Universe ID that you want to manage datastores for. */
    public readonly universeId: number;

    /**
     * @param key Your Open Cloud API key.
     * @param universeId The Universe ID that you want to manage datastores for.
     */
    constructor(key: string, universeId: number) {
        this.apiKey = key;
        this.universeId = universeId;
    }

    /**
     * Returns a list of data stores belonging to an experience.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async listDataStores(optionalParams?: ListDatastoresParams) {
        const url = new URL(`/datastores/v1/universes/${this.universeId}/standard-datastores`, baseApiUrl);

        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });
        if (!response.ok) {
            console.log(`${response.status} - Unable to list data stores for ${this.universeId}.`);
            return undefined;
        }

        const json: ListDatastores = await response.json();
        return json;
    }

    /**
     * Returns a list of entry keys within a data store.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores-datastore-entries
     * @param optionalParams
     */
    public async listEntries(datastoreName: string, optionalParams?: ListEntriesParams) {
        const url = new URL(`/datastores/v1/universes/${this.universeId}/standard-datastores/datastore/entries`, baseApiUrl);

        url.searchParams.set('datastoreName', datastoreName);

        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });
        const json: ListEntries = await response.json();
        
        return json;
    }

    /**
     * Returns the value and metadata associated with an entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores-datastore-entries-entry
     * @param datastoreName The name of the data store.
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async getEntry<T>(datastoreName: string, entryKey: string, optionalParams?: GetEntryParams) {
        const url = new URL(`/datastores/v1/universes/${this.universeId}/standard-datastores/datastore/entries/entry`, baseApiUrl);
        
        url.searchParams.set('datastoreName', datastoreName);
        url.searchParams.set('entryKey', entryKey);
        
        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });
        switch (response.status) {
            case 200:
                const json: T = await response.json();
                const context = {
                    url: new URL(url.href),
                    base: baseApiUrl,
                    apiKey: this.apiKey,
                    attributes: JSON.parse(response.headers.get('roblox-entry-attributes')),
                    userIds: JSON.parse(response.headers.get('roblox-entry-userids'))
                }

                return new DatastoreEntry<T>(context, json);
            case 204:
                console.log(`204 - The key is marked as deleted.`);
                return undefined;
            default:
                console.log(`${response.status} - Unable to fetch this entry.`);
                return undefined;
        }
    }
}