import { OrderedDatastoreEntryInfo } from '../interfaces/DataStores';
import { UpdateOrderedDataStore } from '../interfaces/Parameters';
import { OrderedDataStore } from './OrderedDataStore';

export class OrderedDataStoreEntry {
    /** Context for the original ordered datastore. */
    private readonly context: OrderedDataStore;
    /** The url path for this ordered datastore entry. */
    public readonly path: string;
    /** The id for this ordered datastore entry. */
    public readonly id: string;
    /** The value for this ordered datastore entry. */
    public readonly value: number;

    /**
     * @param service The current DataStoreService
     * @param context The context from the OrderedDataStore.
     * @param entry The datastorey entry.
     */
    constructor(context: OrderedDataStore, entry: OrderedDatastoreEntryInfo) {
        this.context = context;

        this.path = entry.path;
        this.id = entry.id;
        this.value = entry.value;
    }

    /**
     * Deletes the specified entry.
     */
    public async delete() {
        return this.context.delete(this);
    }

    /**
     * Updates an entry value and returns the updated entry.
     *
     * @param value The value to update the entry with.
     * @param parameters Other parameters that this endpont accepts.
     */
    public async update(value: number, parameters?: UpdateOrderedDataStore) {
        return this.context.update(this, value, parameters);
    }

    /**
     * Increments the value of the key by the provided amount and returns the updated entry.
     *
     * @param amount The amount to increment by the entry value. If the input value exceeds the maximum value supported by int64, which is 9,223,372,036,854,775,807, the request fails with a 400 Bad Request error.
     */
    public async increment(amount: number) {
        return this.context.increment(this, amount);
    }
}
