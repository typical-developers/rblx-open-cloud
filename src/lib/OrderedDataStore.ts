import { Entry, ListEntries, ListEntriesParams } from "../types/OrderedDataStoreTypes";
import { baseApiUrl } from "../util/constants";
import { addParams } from "../util/params";

class OrderedDataStoreEntry {
    public readonly datastore: Entry;
    // Will turn this into a separate type later.
    public readonly context: {
        url: URL,
        base: URL,
        apiKey: string
    };

    // TODO: https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#DELETE-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries-_entry_
    public async delete() {

    }

    // TODO: https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#PATCH-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries-_entry_
    public async update() {

    }
}

export class OrderedDataStore {
    readonly apiKey: string;
    readonly universeId: number;

    /**
     * @param key Your Open Cloud API key.
     * @param universeId The Universe ID that you want to manage datastores for.
     */
    constructor(key: string, universeId: number) {
        this.apiKey = key;
        this.universeId = universeId;
    }

    /**
     * Returns a list of entries from an ordered data store.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#GET-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries
     * @param orderedDataStore The name of the target ordered data store.
     * @param scope The range of qualifying values of entries to return. Default is `global`
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async listEntries(orderedDataStore: string, scope: string = "global", optionalParams?: ListEntriesParams) {
        const url = new URL(`/ordered-data-stores/v1/universes/${this.universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries`, baseApiUrl);
        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });
        const json: ListEntries = await response.json();
        
        return json;
    }

    // TODO: https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#POST-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries
    public async createEntry(orderedDataStore: string, scope: string, id: string) {

    }

    // TODO: https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#GET-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries-_entry_
    public async getEntry() {
        
    }
}