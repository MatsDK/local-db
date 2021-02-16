const handleErr = require("./utils/handeErrors");
const connectServer = require("./utils/connect");
const { find, insert } = require("./utils/docs");
const { createLocation, createCollection } = require("./utils/create");
const { showLocations, showCollections } = require("./utils/getColLoc");
const {
  deleteLocation,
  deleteCollection,
  findAndDelete,
} = require("./utils/delete");

const connect = async (loc) => {
  const apiConfig = await connectServer(loc, { connect: true, loc });

  return {
    apiConfig,
    createLocation(props, cb) {
      return createLocation(apiConfig, props, cb);
    },
    showLocations(cb) {
      return showLocations(apiConfig, cb);
    },
    deleteLocation(props, cb) {
      return deleteLocation(apiConfig, props, cb);
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
    deleteOne(query, cb) {
      return findAndDelete({ location, col, conf }, query, { limit: 1 }, cb);
    },
    delete(query, cb) {
      return findAndDelete(
        { location, col, conf },
        query,
        {
          limit: undefined,
        },
        cb
      );
    },
  };
};

const location = (location, conf, cb) => {
  if (typeof location !== "string") throw handleErr(cb, 6);
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
    deleteCollection(props, cb) {
      return deleteCollection(conf, location, props, cb);
    },
  };
};

exports.connect = connect;

exports.api = {
  connect,
  location,
};
