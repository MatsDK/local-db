const fs = require("fs");
const BSON = require("bson");
const { nanoid } = require("nanoid");
const filterItems = require("./findItems");

module.exports = reqHandler = async (conn, req) => {
  try {
    if (req.insertItem) insertItem(conn, req);
    else if (req.findItem) findItem(conn, req);
    else if (req.createLocation) createLocation(conn, req);
    else if (req.createCollection) createCollection(conn, req);
    else if (req.getLocations) getLocations(conn);
    else if (req.getCollections) getCollections(conn, req);
  } catch (err) {
    conn.write(JSON.stringify({ err: err.message }));
  }
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

  if (!loc) return conn.write(JSON.stringify({ err: "location node found" }));

  conn.write(JSON.stringify({ err: false, collections: loc.collections }));
};
