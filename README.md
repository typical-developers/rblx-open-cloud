# Roblox Open Cloud
Better documentation coming in the future (hopefully).

## Examples
### Messaging Service
```js
import { MessagingService } from 'roblox-open-cloud';

const apiKey = '...';
const universeId = 0;

const service = new MessagingService(apiKey, universeId);
const message = {
    Foo: "Bar"
};

await service.publish('topic', message);
```

### Ordered Datastores
```js
import { OrderedDataStore } from 'roblox-open-cloud';

const apiKey = '...';
const universeId = 0;

const datastores = new OrderedDataStore(apiKey, universeId);

// list all entries for the datastore
const entries = await datastores.listEntries("TestStore");

// create a new entry
const newEntry = await datastores.createEntry("TestStore", "global", "User_0", { value: 0 });

// fetch the entry
const entry = await datastores.getEntry("TestStore", "global", "User_0");

// update the entry
const updatedEntry = await entry.update({ value: 1 });

// delete the entry
await entry.delete();
```

### Standard Datastores
```js
import { StandardDataStore } from 'roblox-open-cloud';

const apiKey = '...';
const universeId = 0;

const datastores = new StandardDataStore(apiKey, universeId);

// list all available datastores
const allDatastores = await datastores.listDataStores();

// list all entries for a datastore
const entries = await datastores.listEntries("TestStore");

// get an entry
const entry = await datastores.getEntry("TestStore", "User_0");

// update an entry -- data automatically replaces
const newData = await entry.set({ "Foo": "Bar" });

// fetch an entry's versions
const versions = await entry.versions();

// fetch a specific version
const verison = await entry.version("ID");

// mark the entry for deletion
const delete = await entry.delete();
```