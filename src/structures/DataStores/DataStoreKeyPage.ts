import { baseApiUrl } from '../../util/constants';
import { setParams } from '../../util/url';
import { DataStoreEntryKey } from '../interfaces/DataStores';
import { ListDataStore } from '../interfaces/Parameters';
import { ListDataStoreEntries } from '../interfaces/Responses';
import { DataStore } from './DataStore';
import { DataStoreService } from './DataStoreService';

export class DataStoreKeyPage {
    /** The original datastore service. */
    private readonly service: DataStoreService;
    /** The context for the datastore. */
    private readonly context: DataStore;
    /** Parameters that were used. */
    private readonly parameters: ListDataStore;
    /** The datastores in the experience. */
    public keys: DataStoreEntryKey[];
    /** The token for the next page. */
    public nextPageCursor: string;
    /** Whether or not the current page is the last page available. */
    public isFinished: boolean | undefined;

    constructor(service: DataStoreService, context: DataStore, parameters: ListDataStore) {
        this.service = service;
        this.context = context;
        this.parameters = parameters;

        this.keys = [];
        this.nextPageCursor = '';
        this.isFinished = undefined;
    }

    public async fetchPage() {
        if (this.isFinished) return this;

        const endpoint = new URL(`/datastores/v1/universes/${this.service.universeId}/standard-datastores/datastore/entries`, baseApiUrl);

        endpoint.searchParams.set('datastoreName', this.context.name);
        endpoint.searchParams.set('scope', this.context.scope);
        endpoint.searchParams.set('cursor', this.nextPageCursor);
        if (this.parameters) setParams(endpoint, this.parameters);

        return new Promise<this>(async (res, rej) => {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'x-api-key': this.service.apiKey
                }
            });

            if (!response.ok) {
                return rej(undefined);
            }

            const data: ListDataStoreEntries = await response.json();
            this.keys = data.keys;
            this.nextPageCursor = data.nextPageCursor || '';
            this.isFinished = !data.nextPageCursor?.length;

            return res(this);
        }).catch(() => this);
    }
}
