import { Entry, OrderedDataStoreContext, UpdateDatastoreEntryParams, UpdateEntryRequest } from '../../../types/OrderedDataStoreTypes';
import { baseApiUrl } from '../../../util/constants';
import { addParams } from '../../../util/params';

export class OrderedDataStoreEntry {
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
            method: 'DELETE',
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
        const url = new URL(`${this.context.url.pathname}`, baseApiUrl);

        if (optionalParams) addParams(url, optionalParams);

        if (this.deleted) {
            console.log('You cannot update entries that have been deleted.');
            return this;
        }

        const response = await fetch(this.context.url, {
            method: 'PATCH',
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
