import { baseApiUrl } from '../../util/constants';
import { getEntryURL, setParams } from '../../util/url';
import { GetOrderedDataStore, UpdateOrderedDataStore } from '../interfaces/Parameters';
import { ListEntriesResponse } from '../interfaces/Responses';
import { DataStoreService } from './DataStoreService';
import { OrderedDataStoreEntry } from './OrderedDataStoreEntry';

export class OrderedDataStore {
    /** The original datastore service. */
    private readonly service: DataStoreService;
    /** Parameters that were used to initalize this datastore. */
    private readonly parameters: GetOrderedDataStore;
    /** The name of this ordered datastore. */
    public readonly name: string;
    /** The scope of this ordered datastore. */
    public readonly scope: string;
    /** Entries in this ordered datastore. */
    public entries: OrderedDataStoreEntry[];
    /** Whether or not the current page is the last page available. */
    public isFinished: boolean | undefined;
    /** The token for the next page. */
    public nextPageToken: string;

    constructor(service: DataStoreService, name: string, parameters: GetOrderedDataStore, scope: string) {
        this.service = service;
        this.parameters = parameters;

        this.name = name;
        this.scope = scope;

        this.entries = [];
        this.isFinished = undefined;
        this.nextPageToken = '';
    }

    /**
     * Fetches the page based on the nextPageToken.
     *
     * If entries are not currently initalized, first time running this would get them.
     * Every other time after, it would fetch until the status is finished.
     */
    public async fetchPage() {
        if (this.isFinished) return this;

        const endpoint = new URL(`/ordered-data-stores/v1/universes/${this.service.universeId}/orderedDataStores/${this.name}/scopes/${this.scope}/entries`, baseApiUrl);

        if (this.parameters) setParams(endpoint, this.parameters);
        endpoint.searchParams.set('page_token', this.nextPageToken);

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

            const data: ListEntriesResponse = await response.json();
            this.entries = data.entries.map((entry) => new OrderedDataStoreEntry(this, entry));
            this.nextPageToken = data.nextPageToken;
            this.isFinished = !data.nextPageToken.length;

            return res(this);
        }).catch(() => this);
    }

    /**
     * Creates a new entry with the content value provided.
     *
     * @param id The name of the entry.
     * @param value The value to update the entry with.
     */
    public async create(id: string, value: number) {
        const endpoint = new URL(`/ordered-data-stores/v1/universes/${this.service.universeId}/orderedDataStores/${this.name}/scopes/${this.scope}/entries`, baseApiUrl);

        endpoint.searchParams.append('id', id);

        return new Promise<OrderedDataStoreEntry>(async (res, rej) => {
            // Values can only support up to Int64 numbers.
            if (value > BigInt(9223372036854775807n)) {
                return rej({ failed: true, text: `Entry value is bigger than Int64` });
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'x-api-key': this.service.apiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ value: value })
            });

            if (!response.ok) {
                return rej(undefined);
            }

            const data: OrderedDataStoreEntry = await response.json();

            return res(new OrderedDataStoreEntry(this, data));
        }).catch((reason: undefined) => reason);
    }

    /**
     * Gets and returns the specified entry.
     *
     * @param entry The entry ID.
     */
    public async get(entry: string) {
        const endpoint = new URL(`/ordered-data-stores/v1/universes/${this.service.universeId}/orderedDataStores/${this.name}/scopes/${this.scope}/entries/${entry}`, baseApiUrl);

        return new Promise<OrderedDataStoreEntry>(async (res, rej) => {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'x-api-key': this.service.apiKey
                }
            });

            if (!response.ok) {
                return rej(undefined);
            }

            const data: OrderedDataStoreEntry = await response.json();

            return res(new OrderedDataStoreEntry(this, data));
        }).catch((reason: undefined) => reason);
    }

    /**
     * Deletes the specified entry.
     *
     * @param entry Either an entry id or OrderedDataStoreEntry.
     */
    public async delete(entry: string | OrderedDataStoreEntry) {
        const endpoint = getEntryURL(entry);

        return new Promise<boolean>(async (res, rej) => {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'x-api-key': this.service.apiKey
                }
            });

            if (!response.ok) {
                return rej(false);
            }

            return res(true);
        }).catch((response: boolean) => response);
    }

    /**
     * Updates an entry value and returns the updated entry.
     *
     * @param entry Either an entry id or OrderedDataStoreEntry.
     * @param value The value to update the entry with.
     * @param parameters Other parameters that this endpont accepts.
     */
    public async update(entry: string | OrderedDataStoreEntry, value: number, parameters?: UpdateOrderedDataStore) {
        const endpoint = getEntryURL(entry);

        if (parameters) setParams(endpoint, parameters);

        return new Promise<OrderedDataStoreEntry>(async (res, rej) => {
            // Entries can only support up to Int64.
            if (value > BigInt(9223372036854775807n)) {
                throw new Error(`Number is bigger than Int64`);
            }

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'x-api-key': this.service.apiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ value: value })
            });

            if (!response.ok) {
                return rej(undefined);
            }

            const data: OrderedDataStoreEntry = await response.json();

            return res(new OrderedDataStoreEntry(this, data));
        }).catch((reason: undefined) => reason);
    }

    /**
     * Increments the value of the key by the provided amount and returns the updated entry.
     *
     * @param entry Either an entry id or OrderedDataStoreEntry.
     * @param amount The amount to increment by the entry value. If the input value exceeds the maximum value supported by int64, which is 9,223,372,036,854,775,807, the request fails with a 400 Bad Request error.
     */
    public async increment(entry: string | OrderedDataStoreEntry, amount: number) {
        const endpoint = new URL(`${getEntryURL(entry).pathname}:increment`, baseApiUrl);

        return new Promise<OrderedDataStoreEntry>(async (res, rej) => {
            // Entries can only support up to Int64.
            if (amount > BigInt(9223372036854775807n)) {
                throw new Error(`Number is bigger than Int64`);
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'x-api-key': this.service.apiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ amount: amount })
            });

            if (!response.ok) {
                return rej(undefined);
            }

            const data: OrderedDataStoreEntry = await response.json();

            return res(new OrderedDataStoreEntry(this, data));
        }).catch((reason: undefined) => reason);
    }
}
