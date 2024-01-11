import { GetEntryParams } from '../../../types/StandardDataStoreTypes';
import { BaseDatastoreContext } from '../../../types/global';
import { baseApiUrl } from '../../../util/constants';
import { addParams } from '../../../util/params';
import { StandardDataStoreEntry } from './StandardDataStoreEntry';

export class StandardDataSToreListEntry {
    public readonly context: BaseDatastoreContext;
    public readonly datastoreName: string;
    public readonly entryKey: string;
    public readonly scope?: string;

    /**
     * @param context Context provided when initalized.
     * @param entryKey The entry key for the datastore.
     * @param scope The scope for the entry. Default is `global`.
     */
    constructor(context: { apiKey: string; universeId: number }, datastoreName: string, entryKey: string, scope: string = 'global') {
        this.context = context;
        this.datastoreName = datastoreName;
        this.entryKey = entryKey;
        this.scope = scope;
    }

    /**
     * Returns the value and metadata associated with an entry.
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async getEntry<T>(optionalParams?: GetEntryParams) {
        const url = new URL(`/datastores/v1/universes/${this.context.universeId}/standard-datastores/datastore/entries/entry`, baseApiUrl);

        url.searchParams.set('datastoreName', this.datastoreName);
        url.searchParams.set('entryKey', this.entryKey);

        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.context.apiKey } });
        switch (response.status) {
            case 200:
                const json: T = await response.json();
                const context = {
                    url: new URL(url.href),
                    apiKey: this.context.apiKey,
                    attributes: JSON.parse(response.headers.get('roblox-entry-attributes')),
                    userIds: JSON.parse(response.headers.get('roblox-entry-userids'))
                };

                return new StandardDataStoreEntry<T>(context, json);
            case 204:
                console.log(`204 - The key is marked as deleted.`);
                return undefined;
            default:
                console.log(`${response.status} - Unable to fetch this entry.`);
                return undefined;
        }
    }
}
