import { Entry } from '../../../types/OrderedDataStoreTypes';
import { BaseDatastoreContext } from '../../../types/global';
import { baseApiUrl } from '../../../util/constants';
import { OrderedDataStoreEntry } from './OrderedDataStoreEntry';

export class OrderedDataStoreListEntry {
    public readonly context: BaseDatastoreContext;
    public readonly orderedDataStore: string;
    public readonly scope: string;

    constructor(context: { apiKey: string; universeId: number }, orderedDataStore: string, scope: string = 'global') {
        this.context = context;
        this.orderedDataStore = orderedDataStore;
        this.scope = scope;
    }

    /**
     * Gets and returns the specified entry.
     * @param entry The entry ID.
     */
    public async getEntry(entry: string): Promise<OrderedDataStoreEntry | undefined> {
        const url = new URL(`/ordered-data-stores/v1/universes/${this.context.universeId}/orderedDataStores/${this.orderedDataStore}/scopes/${this.scope}/entries/${entry}`, baseApiUrl);

        const response = await fetch(url, { headers: { 'x-api-key': this.context.apiKey } });

        if (!response.ok) {
            console.log(`${response.status} - Unable to get the specified ordered datastore entry.`);
            return undefined;
        }

        const json: Entry = await response.json();

        return new OrderedDataStoreEntry(
            {
                url: url,
                apiKey: this.context.apiKey
            },
            json
        );
    }
}
