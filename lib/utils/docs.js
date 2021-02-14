const { nanoid } = require("nanoid");
const connectServer = require("./connect");
const handleErr = require("./handeErrors");

const find = async ({ location, col, conf }, inQuery, { limit }, cb) => {
  if (typeof inQuery === "string") return handleErr(cb, 5);

  const query = {
    findItem: true,
    location,
    col,
    limit,
    skip: 0,
    searchQuery: inQuery,
  };

  if (inQuery._limit && !limit) {
    query.searchQuery = undefined;
    query.findAll = true;
    query.limit = inQuery._limit;
  }

  if (inQuery._skip && !limit) {
    query.searchQuery = undefined;
    query.findAll = true;
    query.skip = inQuery._skip;
  }

  if (typeof inQuery === "function" && !cb) {
    query.searchQuery = undefined;
    query.findAll = true;
    cb = inQuery;
  }

  if (
    query.searchQuery &&
    (query.searchQuery._limit || query.searchQuery._skip)
  ) {
    query.findAll = true;
    query.searchQuery = undefined;
  }

  const res = await connectServer(conf.loc, query);

  if (res.err) handleErr(cb, 2, res.err);

  if (cb) cb(null, res.items);
  return res.items;
};

const insert = async ({ location, col, conf }, obj, cb) => {
  if (typeof obj === "function" && !cb) return handleErr(obj, 0);
  if (obj && obj._id) return handleErr(cb, 1);

  const apiItem = { _id: nanoid(), ...obj };
  const returnObj = await connectServer(conf.loc, {
    insertItem: true,
    location,
    col,
    apiItem,
  });

  if (returnObj.err) handleErr(cb, 2, returnObj.err);

  if (cb) cb(null, returnObj.apiItem);
  return returnObj.apiItem;
};

module.exports = { find, insert };
