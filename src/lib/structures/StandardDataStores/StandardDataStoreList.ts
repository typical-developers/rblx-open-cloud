import { ListEntries, ListEntriesParams } from '../../../types/StandardDataStoreTypes';
import { BaseDatastoreContext } from '../../../types/global';
import { baseApiUrl } from '../../../util/constants';
import { addParams } from '../../../util/params';
import { StandardDataSToreListEntry } from './StandardDataStoreListEntry';

export class StandardDataStoreList {
    public readonly context: BaseDatastoreContext;
    public readonly datastoreName: string;

    /**
     * @param context
     * @param datastoreName
     */
    constructor(context: { apiKey: string; universeId: number }, datastoreName: string) {
        this.context = context;
        this.datastoreName = datastoreName;
    }

    /**
     * Returns a list of entry keys within a data store.
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async listEntries(optionalParams?: ListEntriesParams) {
        const url = new URL(`/datastores/v1/universes/${this.context.universeId}/standard-datastores/datastore/entries`, baseApiUrl);

        url.searchParams.set('datastoreName', this.datastoreName);

        if (optionalParams) addParams(url, optionalParams);

        const response = await fetch(url, { headers: { 'x-api-key': this.context.apiKey } });
        const json: ListEntries = await response.json();

        return {
            keys: json.keys.map(
                (entry) =>
                    new StandardDataSToreListEntry(
                        {
                            apiKey: this.context.apiKey,
                            universeId: this.context.universeId
                        },
                        this.datastoreName,
                        entry.key
                    )
            ),
            nextPageCursor: json.nextPageCursor
        };
    }
}
