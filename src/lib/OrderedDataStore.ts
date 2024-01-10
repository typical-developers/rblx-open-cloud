import { CreateEntryRequest, Entry, ListEntries, ListEntriesParams, OrderedDataStoreContext, UpdateDatastoreEntryParams, UpdateEntryRequest } from "../types/OrderedDataStoreTypes";
import { baseApiUrl } from "../util/constants";
import { addParams } from "../util/params";

class OrderedDataStoreEntry {
    private deleted: boolean = false;
    public readonly datastore: Entry;
    public readonly context: OrderedDataStoreContext;

    constructor(context: OrderedDataStoreContext, data: Entry) {
        this.context = context;
        this.datastore = data;
    }

    /**
     * Deletes the specified entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#DELETE-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries-_entry_
     * @returns Whether or not the entry was successfully deleted.
     */
    public async delete() {
        const response = await fetch(this.context.url, {
            method: "DELETE",
            headers: { 'x-api-key': this.context.apiKey }
        });

        if (!response.ok) {
            return false;
        }

        this.deleted = true;
        return true;
    }

    /**
     * Updates an entry value and returns the updated entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#PATCH-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries-_entry_
     * @param request Updates the entry provided with a new value.
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async update(request: UpdateEntryRequest, optionalParams?: UpdateDatastoreEntryParams): Promise<OrderedDataStoreEntry | undefined> {
        const url = new URL(`${this.context.url.pathname}`, this.context.base);

        if (optionalParams) addParams(url, optionalParams);

        if (this.deleted) {
            console.log('You cannot update entries that have been deleted.');
            return this;
        }

        const response = await fetch(this.context.url, {
            method: "PATCH",
            headers: {
                'x-api-key': this.context.apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            console.log(`${response.status} - Unable to create a new ordered datastore entry.`);
            return undefined;
        }

        const json: Entry = await response.json();

        return new OrderedDataStoreEntry(this.context, json);
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
     * @param optionalParams Optional params the endpoint will accept.
     * @param scope The range of qualifying values of entries to return. Default is `global`
     */
    public async listEntries(orderedDataStore: string, optionalParams?: ListEntriesParams, scope: string = "global") {
        const url = new URL(`/ordered-data-stores/v1/universes/${this.universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries`, baseApiUrl);
        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });
        const json: ListEntries = await response.json();
        
        return json;
    }

    /**
     * Creates a new entry with the content value provided.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#POST-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries
     * @param orderedDataStore The name of the ordered data store.
     * @param scope The name of the data store scope. See [Scopes](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#scopes).
     * @param id The name of the entry.
     * @param request Creates a new entry with the value provided.
     */
    public async createEntry(orderedDataStore: string, scope: string, id: string, request: CreateEntryRequest): Promise<OrderedDataStoreEntry | undefined> {
        const url = new URL(`/ordered-data-stores/v1/universes/${this.universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries`, baseApiUrl);

        url.searchParams.set('id', id);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'x-api-key': this.apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            console.log(`${response.status} - Unable to create a new ordered datastore entry.`);
            return undefined;
        }

        const json: Entry = await response.json();
        const context = {
            url: url,
            base: baseApiUrl,
            apiKey: this.apiKey
        };

        return new OrderedDataStoreEntry(context, json);
    }

    /**
     * Gets and returns the specified entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#GET-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries-_entry_
     * @param orderedDataStore The name of the ordered data store.
     * @param scope The name of the data store scope. See [Scopes](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#scopes).
     * @param entry The entry ID.
     */
    public async getEntry(orderedDataStore: string, scope: string, entry: string): Promise<OrderedDataStoreEntry | undefined> {
        const url = new URL(`/ordered-data-stores/v1/universes/${this.universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries/${entry}`, baseApiUrl);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });

        if (!response.ok) {
            console.log(`${response.status} - Unable to get the specified ordered datastore entry.`);
            return undefined;
        }

        const json: Entry = await response.json();
        const context = {
            url: url,
            base: baseApiUrl,
            apiKey: this.apiKey
        };

        return new OrderedDataStoreEntry(context, json);
    }
}