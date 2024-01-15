import { GetOrderedDataStore, ListDataStore } from '../interfaces/Parameters';
import { DataStore } from './DataStore';
import { DataStoreListingPage } from './DataStoreListingPage';
import { OrderedDataStore } from './OrderedDataStore';

export class DataStoreService {
    public readonly apiKey: string;
    public readonly universeId: number;

    /**
     * @param apiKey Your Open Cloud API key.
     * @param universeId The identifier of the experience in which you want to send your messages to. You can [copy your experience's Universe ID](https://create.roblox.com/docs/cloud/open-cloud/usage-messaging#publishing-messages-to-live-servers) on Creator Dashboard.
     */
    constructor(apiKey: string, universeId: number) {
        this.apiKey = apiKey;
        this.universeId = universeId;
    }

    /**
     * Initalizes a datastore.
     * @param name The name for the datastore.
     * @param scope The value is `global` by default. See [Scopes](https://create.roblox.com/docs/cloud-services/datastores#scopes).
     */
    public getDataStore<DataStoreValues>(name: string, scope: string = 'global') {
        return new DataStore<DataStoreValues>(this, name, scope);
    }

    /**
     * Returns a list of entries from an ordered data store.
     *
     * @param name The name of the target ordered data store.
     * @param scope The name of the data store scope. Default is `global`. See [Scopes](https://create.roblox.com/docs/cloud/open-cloud/data-store-api-handling#scopes).
     * @param parameters Other parameters that this endpont accepts.
     */
    public getOrderedDataStore(name: string, parameters: GetOrderedDataStore = {}, scope: string = 'global') {
        return new OrderedDataStore(this, name, parameters, scope);
    }

    public async listDataStore(parameters: ListDataStore) {
        return await new DataStoreListingPage(this, parameters).fetchPage();
    }
}
