import { baseApiUrl } from '../../util/constants';
import { setParams } from '../../util/url';
import { DataStoreEntryVersion } from '../interfaces/DataStores';
import { ListEntryVersions } from '../interfaces/Parameters';
import { ListEntryVersionResponse } from '../interfaces/Responses';
import { DataStore } from './DataStore';
import { DataStoreService } from './DataStoreService';

export class DataStoreVersionPages {
    /** The context for the datastore. */
    private readonly service: DataStoreService;
    /** The context for the datastore. */
    private readonly context: DataStore;
    /** Parameters that were used to initalize this datastore. */
    private readonly parameters: ListEntryVersions;
    /** The key for the datastore entry. */
    public readonly key: string;
    /** Versions for this datastor entry */
    public versions: DataStoreEntryVersion[];
    /** The token for the next page. */
    public nextPageCursor: string;
    /** Whether or not the current page is the last page available. */
    public isFinished: boolean | undefined;

    constructor(service: DataStoreService, context: DataStore, parameters: ListEntryVersions = {}, key: string) {
        this.service = service;
        this.context = context;
        this.parameters = parameters;

        this.key = key;

        this.versions = [];
        this.nextPageCursor = '';
        this.isFinished = undefined;
    }

    /**
     * Fetches the page based on the nextPageCursor.
     */
    public async fetchPage() {
        const endpoint = new URL(`/datastores/v1/universes/${this.service.universeId}/standard-datastores/datastore/entries/entry/versions`, baseApiUrl);

        endpoint.searchParams.set('datastoreName', this.context.name);
        endpoint.searchParams.set('entryKey', this.key);
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

            const data: ListEntryVersionResponse = await response.json();
            this.versions = data.versions;
            this.nextPageCursor = data.nextPageCursor;
            this.isFinished = !data.nextPageCursor.length;

            return res(this);
        }).catch(() => this);
    }
}
