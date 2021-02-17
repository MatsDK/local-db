const { api, connect } = require("./lib/bundle");

const run = async () => {
  const conn = await connect({ port: 3000, host: "127.0.0.1" });
  const loc = api.location("1", conn.apiConfig);

  // await loc
  //   .collection("1")
  //   .update({}, { newProp: "21" }, { _replace: false }, (err, updatedDocs) => {
  //     if (err) throw err;
  //     console.table(updatedDocs);
  //   });

  // await loc
  //   .collection("1")
  //   .updateOne(
  //     { userId: "test" },
  //     { userName: "test" },
  //     { _skip: 2 },
  //     (err, updatedDocs) => {
  //       if (err) throw err;
  //       console.log(updatedDocs);
  //     }
  //   );

  // await loc
  //   .collection("1")
  //   .delete({ id: 2 }, { _limit: 5, _skip: 3 }, (err) => {
  //     if (err) throw err;
  //   });

  // await loc
  //   .collection("1")
  //   .deleteOne({ userId: "test" }, { _skip: 1 }, (err) => {
  //     if (err) throw err;
  //   });

  // await loc.deleteCollection("1", (err) => {
  //   if (err) throw err;
  // });

  // await conn.deleteLocation("loc", (err) => {
  //   if (err) throw err;
  // });

  // await loc
  //   .collection("1")
  //   .find({ userId: "test" }, { _skip: 0, _limit: 30 }, (err, docs) => {
  //     if (err) throw err;
  //     console.log(docs);
  //   });

  // await loc
  //   .collection("1")
  //   .findOne({ userId: "test" }, { _skip: 0 }, (err, docs) => {
  //     if (err) throw err;
  //     console.log(docs);
  //   });

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
