const { api, connect } = require("./lib/bundle");

const run = async () => {
  const conn = await connect({ port: 3000, host: "127.0.0.1" });

  const loc = api.location("1", conn.apiConfig);

  // const newItem = {
  //   userId: 222,
  //   id: 6,
  // };

  // await loc.collection("1").delete((err) => {
  //   if (err) throw err;
  // });

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

  // await loc.collection("1").find((err, docs) => {
  //   if (err) throw err;
  //   console.log(docs);
  // });

  // await loc.showCollections((err, cols) => {
  //   if (err) throw err;
  //   console.log(cols);
  // });

  // await conn.showLocations((err, locations) => {
  //   if (err) throw err;
  //   console.log(locations);
  // });

  // await loc.createCollection("1", (err) => {
  //   if (err) throw err;
  // });

  // await conn.createLocation("1", (err) => {
  //   if (err) throw err;
  // });

  // await loc.collection("1").insert(newItem, (err, doc) => {
  //   if (err) throw err;
  //   console.log(doc);
  // });

  // for (let i = 0; i < 25; i++) {
  //   await loc.collection("1").insert({ userId: "test", id: i }, (err, doc) => {
  //     if (err) throw err;
  //     console.log(doc);
  //   });
  // }
};

run();
