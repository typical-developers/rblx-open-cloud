import { baseApiUrl } from '../../util/constants';
import { setParams } from '../../util/url';
import { DataStoreEntry } from '../interfaces/DataStores';
import { ListDataStore } from '../interfaces/Parameters';
import { ListDataStoresResponse } from '../interfaces/Responses';
import { DataStoreService } from './DataStoreService';

export class DataStoreListingPage {
    /** The original datastore service. */
    private readonly service: DataStoreService;
    /** Parameters that were used. */
    private readonly parameters: ListDataStore;
    /** The datastores in the experience. */
    public datastores: DataStoreEntry[];
    /** The token for the next page. */
    public nextPageCursor: string;
    /** Whether or not the current page is the last page available. */
    public isFinished: boolean | undefined;

    constructor(service: DataStoreService, parameters: ListDataStore) {
        this.service = service;
        this.parameters = parameters;

        this.datastores = [];
        this.nextPageCursor = '';
        this.isFinished = undefined;
    }

    /**
     * Fetches the page based on the nextPageCursor.
     */
    public async fetchPage() {
        if (this.isFinished) return this;

        const endpoint = new URL(`/datastores/v1/universes/${this.service.universeId}/standard-datastores`, baseApiUrl);

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

            const data: ListDataStoresResponse = await response.json();
            this.datastores = data.datastores;
            this.nextPageCursor = data.nextPageCursor;
            this.isFinished = !data.nextPageCursor.length;

            return res(this);
        }).catch(() => this);
    }
}
