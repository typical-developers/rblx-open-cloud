import { DataStoreKeyInfo } from '../interfaces/DataStores';
import { ListEntryVersions } from '../interfaces/Parameters';
import { DataStore } from './DataStore';
import { deepReplace } from '../../util/replace';
import { DeepPartial } from '../../types/global';

export class DataStoreEntry<DataStoreValue> {
    /** The context for the datastore. */
    private readonly context: DataStore;
    /** The key for the datastore entry. */
    public readonly key: string;
    /** When the entry was created. */
    public readonly createdTime: string;
    /** When the entry was last updated. */
    public readonly updatedTime: string;
    /** Attributes associated with the returned entry. */
    public readonly attributes: object;
    /** Comma-separated list of Roblox user IDs tagged with the entry */
    public readonly userIds: number[] | never[];
    /** The version of this entry. */
    public readonly version: string;
    /** The contents for the datastore entry. */
    public readonly entry: DataStoreValue;

    constructor(context: DataStore, key: string, info: DataStoreKeyInfo, entry: DataStoreValue) {
        this.context = context;

        this.key = key;

        this.createdTime = info.createdTime;
        this.updatedTime = info.updatedTime;
        this.attributes = info.attributes;
        this.userIds = info.userIds;
        this.version = info.version;

        this.entry = entry;
    }

    /**
     * Sets the specific entry with new data (compares current data to new and automatically replaces modified values).
     *
     * Do not use this if your entry data is going to be completely different from what the entry currently has.
     * Instead, fetch the entry and use {@link DataStore.set} while passing in data from the fetched entry.
     *
     * @param entry The value for the entry.
     */
    public async set(entry: DeepPartial<DataStoreValue>) {
        const data = deepReplace<DataStoreValue>(this.entry, entry);

        return this.context.set(this.key, data, this.attributes, this.userIds);
    }

    /**
     * Updates the specific entry version with new data (compares current data to new and automatically replaces modified values).
     *
     * Do not use this if your entry data is going to be completely different from what the entry currently has.
     * Instead, fetch the entry and use {@link DataStore.set} while passing in data from the fetched entry.
     *
     * @param entry The value for the entry.
     */
    public async update(entry: DeepPartial<DataStoreValue>) {
        const data = deepReplace<DataStoreValue>(this.entry, entry);

        return this.context.set(this.key, data, this.attributes, this.userIds, { matchVerson: this.version });
    }

    /**
     * Marks the entry as deleted by creating a tombstone version. Entries are deleted permanently after 30 days.
     */
    public async remove() {
        return this.context.remove(this.key);
    }

    public async increment() {
        return this.context.increment();
    }

    /**
     * Returns a list of data stores belonging to an experience.
     * @param parameters Other parameters that this endpont accepts.
     */
    public async listVersions(parameters?: ListEntryVersions) {
        return await this.context.listVersions(this.key, parameters);
    }

    /**
     * Returns the value and metadata of a specific version of an entry.
     *
     * @param version The version to inspect.
     */
    public async getVersion(version: string) {
        return await this.context.getVersion(this.key, version);
    }
}
