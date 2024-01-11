import { StandardDataStoreEntry } from './StandardDataStoreEntry';
import { ListDatastoresParams, ListDatastores, ListEntriesParams, ListEntries, GetEntryParams } from '../../../types/StandardDataStoreTypes';
import { baseApiUrl } from '../../../util/constants';
import { addParams } from '../../../util/params';
import { StandardDataStoreList } from './StandardDataStoreList';
import { StandardDataSToreListEntry } from './StandardDataStoreListEntry';

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
        return {
            datastores: json.datastores.map((datastore) => new StandardDataStoreList({ apiKey: this.apiKey, universeId: this.universeId }, datastore.name)),
            nextPageCursor: json.nextPageCursor
        };
    }

    /**
     * Returns a list of entry keys within a data store.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores-datastore-entries
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async listEntries(datastoreName: string, optionalParams?: ListEntriesParams) {
        const url = new URL(`/datastores/v1/universes/${this.universeId}/standard-datastores/datastore/entries`, baseApiUrl);

        url.searchParams.set('datastoreName', datastoreName);

        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });
        const json: ListEntries = await response.json();

        return {
            keys: json.keys.map(
                (entry) =>
                    new StandardDataSToreListEntry(
                        {
                            apiKey: this.apiKey,
                            universeId: this.universeId
                        },
                        datastoreName,
                        entry.key
                    )
            ),
            nextPageCursor: json.nextPageCursor
        };
    }

    /**
     * Returns the value and metadata associated with an entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores-datastore-entries-entry
     * @param datastoreName The name of the data store.
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async getEntry<T>(datastoreName: string, entryKey: string, optionalParams?: GetEntryParams): Promise<StandardDataStoreEntry<T> | undefined> {
        const url = new URL(`/datastores/v1/universes/${this.universeId}/standard-datastores/datastore/entries/entry`, baseApiUrl);

        url.searchParams.set('datastoreName', datastoreName);
        url.searchParams.set('entryKey', entryKey);

        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.apiKey } });
        switch (response.status) {
            case 200:
                const json: T = await response.json();
                return new StandardDataStoreEntry<T>(
                    {
                        url: new URL(url.href),
                        apiKey: this.apiKey,
                        attributes: JSON.parse(response.headers.get('roblox-entry-attributes')),
                        userIds: JSON.parse(response.headers.get('roblox-entry-userids'))
                    },
                    json
                );
            case 204:
                console.log(`204 - The key is marked as deleted.`);
                return undefined;
            default:
                console.log(`${response.status} - Unable to fetch this entry.`);
                return undefined;
        }
    }
}
