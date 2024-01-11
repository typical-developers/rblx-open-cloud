import { OrderedDataStoreEntry } from './OrderedDataStoreEntry';
import { CreateEntryRequest, Entry, ListEntries, ListEntriesParams } from '../../../types/OrderedDataStoreTypes';
import { baseApiUrl } from '../../../util/constants';
import { addParams } from '../../../util/params';

export class OrderedDataStore {
    public readonly apiKey: string;
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
     * Returns a list of entries from an ordered data store.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/ordered-v1#GET-v1-universes-_universeId_-orderedDataStores-_orderedDataStore_-scopes-_scope_-entries
     * @param orderedDataStore The name of the target ordered data store.
     * @param optionalParams Optional params the endpoint will accept.
     * @param scope The range of qualifying values of entries to return. Default is `global`
     */
    public async listEntries(orderedDataStore: string, optionalParams?: ListEntriesParams, scope: string = 'global') {
        const url = new URL(`/ordered-data-stores/v1/universes/${this.universeId}/orderedDataStores/${orderedDataStore}/scopes/${scope}/entries`, baseApiUrl);
        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });
        const json: ListEntries = await response.json();

        return {
            entries: json.entries.map((entry) => new OrderedDataStoreEntry({ url: url, apiKey: this.apiKey }, entry)),
            nextPageToken: json.nextPageToken
        };
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
            method: 'POST',
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

        return new OrderedDataStoreEntry(
            {
                url: url,
                apiKey: this.apiKey
            },
            json
        );
    }
}
