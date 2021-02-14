const connectServer = require("./utils/connect");
const { find, insert } = require("./utils/docs");
const { createLocation, createCollection } = require("./utils/create");
const { showLocations, showCollections } = require("./utils/getColLoc");

const connect = async (loc) => {
  const apiConfig = await connectServer(loc, { connect: true, loc });

  return {
    createLocation(props, cb) {
      return createLocation(apiConfig, props, cb);
    },
    apiConfig,
    showLocations(cb) {
      return showLocations(apiConfig, cb);
    },
  };
};

const collection = (location, col, conf) => {
  if (!col) return;

  return {
    find(query, cb) {
      return find({ location, col, conf }, query, { limit: undefined }, cb);
    },
    findOne(query, cb) {
      return find({ location, col, conf }, query, { limit: 1 }, cb);
    },
    insert(item, cb) {
      return insert({ location, col, conf }, item, cb);
    },
  };
};

const location = (location, conf) => {
  return {
    collection(col) {
      return collection(location, col, conf);
    },
    showCollections(cb) {
      return showCollections(location, conf, cb);
    },
    createCollection(colName, cb) {
      return createCollection(conf, location, colName, cb);
    },
  };
};

exports.connect = connect;

exports.api = {
  connect,
  location,
};
