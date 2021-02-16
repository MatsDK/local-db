const BSON = require("bson");

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

module.exports = { deleteCollection, deleteLocation, findAndDelete };
