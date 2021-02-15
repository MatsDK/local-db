const { api, connect } = require("./lib/bundle");

const test = async () => {
  const conn = await connect({ port: 3000, host: "127.0.0.1" });

  const loc = api.location("loc", conn.apiConfig);

  // const newItem = {
  //   userId: 222,
  //   id: 5,
  //   title: "test21",
  //   body: "test21212121",
  //   date: new Date(),
  // };

  // await loc.deleteCollection("test", (err) => {
  //   if (err) throw err;
  // });

  // await conn.deleteLocation("loc", (err) => {
  //   if (err) throw err;
  // });

  // await loc.collection("col").findOne({ userId: 2 }, (err, docs) => {
  //   if (err) throw err;
  //   console.log(docs);
  // });
  // const items = await loc.collection("col").find({ _skip: 2, _limit: 2 });

  // await loc.showCollections((err, cols) => {
  //   if (err) throw err;
  //   console.log(cols);
  // });

  // await conn.showLocations((err, locations) => {
  //   if (err) throw err;
  //   console.log(locations);
  // });

  // await loc.createCollection("test", (err) => {
  //   if (err) throw err;
  // });

  // await conn.createLocation("loc", (err) => {
  //   if (err) throw err;
  // });

  // await loc.collection("col").insert(newItem, (err, doc) => {
  //   if (err) throw err;
  //   console.log(doc);
  // });
};

test();
