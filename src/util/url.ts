import { OrderedDataStoreEntry } from '../structures/DataStores/OrderedDataStoreEntry';
import { baseApiUrl } from './constants';

/**
 * Automatically set the params for a url.
 * @param url The URL you want to add params to.
 * @param params The params you want to add to the URL.
 */
export function setParams<T extends object = object>(url: URL, params: T) {
    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
    }
}

/**
 * Automatically creates the entry url based on it being a string or OrderedDataStoreEntry
 * @param entry Either an entry id or OrderedDataStoreEntry.
 * @returns {URL}
 */
export function getEntryURL(entry: string | OrderedDataStoreEntry): URL {
    let endpoint: URL;

    if (typeof entry !== 'string') {
        if (!(entry instanceof OrderedDataStoreEntry)) {
            throw new Error('Provided entry is neither a string nor instance of OrderedDataStoreEntry');
        }

        endpoint = new URL(`/ordered-data-stores/v1/${entry.path}`, baseApiUrl);
    } else {
        endpoint = new URL(`/ordered-data-stores/v1/universes/${this.service.universeId}/orderedDataStores/${this.name}/scopes/${this.scope}/entries/${entry}`, baseApiUrl);
    }

    return endpoint;
}
