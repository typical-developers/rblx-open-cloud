import { DatastoreContext, EntryVersionParams, EntryVersionsParams, ListEntryVersions } from '../../../types/StandardDataStoreTypes';
import { DeepPartial } from '../../../types/global';
import { baseApiUrl } from '../../../util/constants';
import { addParams } from '../../../util/params';
import { deepReplace } from '../../../util/replace';
import { createHash } from 'crypto';

export class StandardDataStoreEntry<T> {
    private deleted: boolean = false;
    public readonly datastore: T;
    public readonly context: DatastoreContext;

    /**
     * @param context Context passed through when the datastore was requested
     * @param data The datastore contents
     */
    constructor(context: DatastoreContext, data: T) {
        this.context = context;
        this.datastore = data;
    }

    /**
     * Sets the value, metadata and user IDs associated with an entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#POST-v1-universes-_universeId_-standard-datastores-datastore-entries-entry
     * @param newData New data to replace current data with. Will automatically replace new data.
     */
    public async set(newData: DeepPartial<T>): Promise<StandardDataStoreEntry<T> | undefined> {
        const data = deepReplace<T>(this.datastore, newData);
        const hash = createHash('md5').update(JSON.stringify(data)).digest('base64');

        if (this.deleted) {
            console.log('You cannot set data for a deleted entry.');
            return undefined;
        }

        const response = await fetch(this.context.url, {
            method: 'POST',
            headers: {
                'x-api-key': this.context.apiKey,
                'content-md5': hash,
                'content-type': 'application/json',
                'roblox-entry-userids': JSON.stringify(this.context.userIds),
                'roblox-entry-attributes': JSON.stringify(this.context.attributes)
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.log(`${response.status} - Unable to set datastore entry.`);
            return undefined;
        }

        return new StandardDataStoreEntry(this.context, data);
    }

    /**
     * Marks the entry as deleted by creating a tombstone version. Entries are deleted permanently after 30 days.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#DELETE-v1-universes-_universeId_-standard-datastores-datastore-entries-entry
     * @returns Whether or not the entry was successfully marked as deleted.
     */
    public async delete() {
        if (this.deleted) {
            return this.deleted;
        }

        const response = await fetch(this.context.url, {
            method: 'DELETE',
            headers: { 'x-api-key': this.context.apiKey }
        });

        if (!response.ok) {
            return this.deleted;
        }

        this.deleted = true;
        return this.deleted;
    }

    /**
     * Returns the value and metadata of a specific version of an entry.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores-datastore-entries-entry-versions-version
     * @param versionId The version to inspect.
     */
    public async version(versionId: string, optionalParams?: EntryVersionParams): Promise<StandardDataStoreEntry<T> | undefined> {
        const url = new URL(`${this.context.url.pathname}/versions/version${this.context.url.search}`, baseApiUrl);

        url.searchParams.set('versionId', versionId);

        if (optionalParams) addParams(url, optionalParams);

        if (this.deleted) {
            console.log('You cannot get a version for a deleted entry.');
            return undefined;
        }

        const response = await fetch(url, { headers: { 'x-api-key': this.context.apiKey } });
        if (!response.ok) {
            return undefined;
        }

        const json: T = await response.json();
        return new StandardDataStoreEntry<T>(this.context, json);
    }

    /**
     * Returns a list of data stores belonging to an experience.
     * @link https://create.roblox.com/docs/reference/cloud/datastores-api/v1#GET-v1-universes-_universeId_-standard-datastores-datastore-entries-entry-versions
     * @param optionalParams Optional params the endpoint will accept.
     */
    public async versions(optionalParams?: EntryVersionsParams) {
        const url = new URL(`${this.context.url.pathname}/versions${this.context.url.search}`, baseApiUrl);

        if (optionalParams) addParams(url, optionalParams);

        if (this.deleted) {
            console.log('You cannot get versions for a deleted entry.');
            return undefined;
        }

        const response = await fetch(url, { headers: { 'x-api-key': this.context.apiKey } });
        if (!response.ok) {
            console.log(`${response.status} - Unable to fetch entry versions.`);
            return undefined;
        }

        const json: ListEntryVersions = await response.json();
        return json;
    }
}
