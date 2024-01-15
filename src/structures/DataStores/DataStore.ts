import { createHash } from 'crypto';
import { baseApiUrl } from '../../util/constants';
import { setParams } from '../../util/url';
import { DataStoreEntryVersion, DataStoreKeyInfo } from '../interfaces/DataStores';
import { ListDataStore, ListEntryVersions, UpdateDataStore } from '../interfaces/Parameters';
import { DataStoreEntry } from './DataStoreEntry';
import { DataStoreService } from './DataStoreService';
import { DataStoreVersionPages } from './DataStoreVersionPage';
import { DataStoreKeyPage } from './DataStoreKeyPage';

export class DataStore<DataStoreValues = unknown> {
    /** The original datastore service. */
    private readonly service: DataStoreService;
    /** The name of this datastore. */
    public readonly name: string;
    /** The scope of this datastore. */
    public readonly scope: string;

    constructor(service: DataStoreService, name: string, scope: string = 'global') {
        this.service = service;

        this.name = name;
        this.scope = scope;
    }

    /**
     * Returns a list of entry keys within a data store.
     *
     * @param parameters Other parameters that this endpont accepts.
     */
    public async listKeys(parameters: ListDataStore = {}) {
        return await new DataStoreKeyPage(this.service, this, parameters).fetchPage();
    }

    /**
     * Returns the value and metadata associated with an entry.
     *
     * @param key The key identifying the entry.
     */
    public async get(key: string) {
        const endpoint = new URL(`/datastores/v1/universes/${this.service.universeId}/standard-datastores/datastore/entries/entry`, baseApiUrl);

        endpoint.searchParams.set('datastoreName', this.name);
        endpoint.searchParams.set('entryKey', key);
        endpoint.searchParams.set('scope', this.scope);

        return new Promise<DataStoreEntry<DataStoreValues>>(async (res, rej) => {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'x-api-key': this.service.apiKey
                }
            });

            if (!response.ok) {
                return rej(undefined);
            }

            const headers = response.headers;
            const info: DataStoreKeyInfo = {
                createdTime: headers.get('roblox-entry-created-time')!,
                updatedTime: headers.get('roblox-entry-version-created-time')!,
                version: headers.get('roblox-entry-version')!,
                attributes: JSON.parse(headers.get('roblox-entry-attributes')!),
                userIds: JSON.parse(headers.get('roblox-entry-userids')!)
            };

            const data: DataStoreValues = await response.json();

            return res(new DataStoreEntry<DataStoreValues>(this, key, info, data));
        }).catch((reason: undefined) => reason);
    }

    /**
     * Returns the value and metadata of a specific version of an entry.
     *
     * @param key The key identifying the entry.
     * @param version The version to inspect.
     */
    public async getVersion(key: string, version: string) {
        const endpoint = new URL(`/datastores/v1/universes/${this.service.universeId}/standard-datastores/datastore/entries/entry/versions/version`, baseApiUrl);

        endpoint.searchParams.set('datastoreName', this.name);
        endpoint.searchParams.set('scope', this.scope);
        endpoint.searchParams.set('entryKey', key);
        endpoint.searchParams.set('versionId', version);

        return new Promise<DataStoreEntry<DataStoreValues>>(async (res, rej) => {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'x-api-key': this.service.apiKey
                }
            });

            if (!response.ok) {
                return rej(undefined);
            }

            const headers = response.headers;
            const info: DataStoreKeyInfo = {
                createdTime: headers.get('roblox-entry-created-time')!,
                updatedTime: headers.get('roblox-entry-version-created-time')!,
                version: headers.get('roblox-entry-version')!,
                attributes: JSON.parse(headers.get('roblox-entry-attributes')!),
                userIds: JSON.parse(headers.get('roblox-entry-userids')!)
            };

            const data: DataStoreValues = await response.json();

            return res(new DataStoreEntry<DataStoreValues>(this, key, info, data));
        }).catch((response: undefined) => response);
    }

    /**
     * Sets a specific entry with raw data. This should generally be used for creating new entries and not be relied on for updating versions / adding new versions for an entry.
     * This does not automatically replace any data since there is no way to know what data is being replaced without fetching the actual entry.
     *
     * The {@link DataStoreEntry} class has methods that will automatically replace data based on the entry.
     * If you are wanting to set an entry and use existing data, please get that entry and use {@link DataStoreEntry.set()}.
     * If you are wanting to update the entry version with existing data, please get that entry and use {@link DataStoreEntry.update()}.
     *
     * @param key The key identifying the entry.
     * @param entry The values for the entry.
     * @param attributes Attributes to be associated with new version of the entry. Serialized by JSON map objects. If not provided, existing attributes are cleared.
     * @param userIds Comma-separated list of Roblox user IDs tagged with the entry. If not provided, existing user IDs are cleared.
     * @param parameters Other parameters that this endpont accepts.
     */
    public async set(key: string, entry: DataStoreValues, attributes: object, userIds: number[] | never[], parameters?: UpdateDataStore) {
        const endpoint = new URL(`/datastores/v1/universes/${this.service.universeId}/standard-datastores/datastore/entries/entry`, baseApiUrl);

        endpoint.searchParams.set('datastoreName', this.name);
        endpoint.searchParams.set('scope', this.scope);
        endpoint.searchParams.set('entryKey', key);
        if (parameters) setParams(endpoint, parameters);

        return new Promise<DataStoreEntry<DataStoreValues>>(async (res, rej) => {
            const hash = createHash('md5').update(JSON.stringify(entry)).digest('base64');

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'x-api-key': this.service.apiKey,
                    'content-type': 'application/json',
                    'content-md5': hash,
                    'roblox-entry-userids': JSON.stringify(userIds),
                    'roblox-entry-attributes': JSON.stringify(attributes)
                },
                body: JSON.stringify(entry)
            });

            if (!response.ok) {
                return rej(undefined);
            }

            const data: DataStoreEntryVersion = await response.json();
            const info: DataStoreKeyInfo = {
                createdTime: data.createdTime,
                updatedTime: data.createdTime,
                version: data.version,
                attributes: attributes,
                userIds: userIds
            };

            return res(new DataStoreEntry<DataStoreValues>(this, key, info, entry));
        }).catch((reason: undefined) => reason);
    }

    /**
     * Marks the entry as deleted by creating a tombstone version. Entries are deleted permanently after 30 days.
     *
     * @param key The key identifying the entry.
     */
    public async remove(key: string) {
        const endpoint = new URL(`/datastores/v1/universes/${this.service.universeId}/standard-datastores/datastore/entries/entry`, baseApiUrl);

        endpoint.searchParams.set('datastoreName', this.name);
        endpoint.searchParams.set('scope', this.scope);
        endpoint.searchParams.set('entryKey', key);

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

    // TODO: Unsure how this works with standard datastores.
    public async increment() {
        throw new Error('Increment is not yet implemented.');
    }

    /**
     * Returns a list of entries belonging to a datastore entry.
     *
     * @param key Returns a list of data stores belonging to an experience.
     * @param parameters Other parameters that this endpont accepts.
     */
    public async listVersions(key: string, parameters: ListEntryVersions = {}) {
        return await new DataStoreVersionPages(this.service, this, parameters, key).fetchPage();
    }
}
