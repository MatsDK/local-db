const fs = require("fs");
const BSON = require("bson");
const { nanoid } = require("nanoid");
const filterItems = require("./findItems");

module.exports = reqHandler = async (conn, req) => {
  try {
    switch (true) {
      case req.getCollections:
        getCollections(conn, req);
        break;
      case req.getLocations:
        getLocations(conn);
        break;
      case req.insertItem:
        insertItem(conn, req);
        break;
      case req.findItem:
        findItem(conn, req);
        break;
      case req.createLocation:
        createLocation(conn, req);
        break;
      case req.createCollection:
        createCollection(conn, req);
        break;
      case req.deleteLocation:
        deleteLocation(conn, req);
        break;
      case req.deleteCollection:
        deleteCollection(conn, req);
        break;
      case req.findAndDelete:
        findAndDelete(conn, req);
        break;
      default:
        return;
    }
  } catch (err) {
    conn.write(JSON.stringify({ err }));
  }
};

const findAndDelete = (conn, req) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const loc = locs.dbs.find((x) => x.name === req.location);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  const col = loc.collections.find((x) => x.name === req.col);
  if (!col) return conn.write(JSON.stringify({ err: "collection not found" }));

  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${col.colId}`)
  );

  if (req.limit === null) req.limit = Infinity;

  if (!req.deleteAll) {
    let changed = 0;
    for (let i = 0; i < data.items.length; i++) {
      if (changed + 1 > req.limit) break;

      const keys = Object.keys(req.searchQuery).map((x) => [
        x,
        req.searchQuery[x],
      ]);

      let isValid = true;
      keys.forEach((x) => {
        if (data.items[i][x[0]] !== x[1]) isValid = false;
      });

      if (isValid) {
        changed++;
        data.items.splice(i, 1);
        i--;
      }
    }
  } else data.items = [];

  fs.writeFileSync(`./data/collection-${col.colId}`, BSON.serialize(data));

  conn.write(JSON.stringify({ err: false }));
};

const deleteCollection = (conn, req) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const loc = locs.dbs.find((x) => x.name === req.location);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  const col = loc.collections.find((x) => x.name === req.name);
  if (!col) return conn.write(JSON.stringify({ err: "collection not found" }));

  if (fs.existsSync(`./data/collection-${col.colId}`))
    fs.unlinkSync(`./data/collection-${col.colId}`);

  loc.collections.forEach((x, i) => {
    if (x.colId === col.colId) loc.collections.splice(i, 1);
  });

  fs.writeFileSync("./data/dbData", BSON.serialize(locs));
  conn.write(JSON.stringify({ err: false }));
};

const deleteLocation = (conn, req) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const loc = locs.dbs.find((x) => x.name === req.name);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  loc.collections.forEach((collection) => {
    const path = `./data/collection-${collection.colId}`;
    if (fs.existsSync(path)) fs.unlinkSync(path);
  });

  locs.dbs.forEach((x, i) => {
    if (x.locId === loc.locId) locs.dbs.splice(i, 1);
  });

  fs.writeFileSync("./data/dbData", BSON.serialize(locs));
  conn.write(JSON.stringify({ err: false }));
};

const findItem = (conn, req) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const loc = locs.dbs.find((x) => x.name === req.location);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  const col = loc.collections.find((x) => x.name === req.col);
  if (!col) return conn.write(JSON.stringify({ err: "collection not found" }));

  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${col.colId}`)
  );
  const items = filterItems(data.items, req);

  conn.write(JSON.stringify({ items }));
};

const insertItem = (conn, req) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData")).dbs;

  const loc = locs.find((x) => x.name === req.location);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  const colRef = loc.collections.find((x) => x.name === req.col);
  if (!colRef)
    return conn.write(JSON.stringify({ err: "collection not found" }));

  const col = BSON.deserialize(
    fs.readFileSync(`./data/collection-${colRef.colId}`)
  );
  col.items.unshift(req.apiItem);

  fs.writeFileSync(`./data/collection-${colRef.colId}`, BSON.serialize(col));

  conn.write(JSON.stringify({ apiItem: req.apiItem }));
};

const createLocation = (conn, req) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const exists = dbs.dbs.find((x) => x.name === req.name);

  if (exists)
    return conn.write(JSON.stringify({ err: "location already exists" }));

  dbs.dbs.push({
    locId: nanoid(),
    name: req.name,
    collections: new Array(),
  });
  fs.writeFileSync(`./data/dbData`, BSON.serialize(dbs));

  conn.write(JSON.stringify({ err: false }));
};

const createCollection = (conn, req) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));

  const loc = dbs.dbs.find((x) => x.name === req.loc);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  if (loc.collections.find((x) => x.name === req.colName))
    return conn.write(JSON.stringify({ err: "collection already exists" }));

  const colId = nanoid();
  loc.collections.push({ name: req.colName, colId });

  fs.writeFileSync(`./data/dbData`, BSON.serialize(dbs));
  fs.writeFileSync(`./data/collection-${colId}`, BSON.serialize({ items: [] }));

  conn.write(JSON.stringify({ err: false }));
};

const getLocations = (conn) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));

  if (dbs) return conn.write(JSON.stringify({ locs: dbs.dbs }));
  conn.write(JSON.stringify({ err: "locations not found" }));
};

const getCollections = (conn, req) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));

  if (!dbs) return conn.write(JSON.stringify({ err: "locations not found" }));

  const loc = dbs.dbs.find((x) => x.name === req.location);

  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  conn.write(JSON.stringify({ err: false, collections: loc.collections }));
};
