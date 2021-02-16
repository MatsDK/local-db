const { nanoid } = require("nanoid");
const connectServer = require("./connect");
const handleErr = require("./handeErrors");

const parseFindParams = (params) => {
  let searchQuery,
    limit,
    skip,
    cb,
    findAll = false;

  if (params.limit) limit = 1;
  if (typeof params.cb === "function") cb = params.cb;
  else if (typeof params.options === "function" && !cb) cb = params.options;
  else if (typeof params.query === "function" && !params.cb && !params.options)
    cb = params.query;

  if (typeof params.query === "object") {
    if (params.query._limit !== undefined || params.query._skip !== undefined) {
      if (!limit) limit = params.query._limit;
      skip = params.query._skip;
    } else {
      if (params.query === undefined) findAll = true;
      searchQuery = params.query;
    }
  }

  if (typeof params.options === "object") {
    if (limit === undefined || skip === undefined) {
      if (params.options._limit !== undefined && limit !== 1) {
        limit = params.options._limit;
      }

      if (params.options._skip !== undefined) skip = params.options._skip;
      else skip = 0;
    }
  }

  if (
    typeof params.options !== "object" &&
    (params.query._limit !== undefined ||
      params.query._skip !== undefined ||
      typeof params.query !== "object")
  )
    findAll = true;

  if (limit === undefined) limit = Infinity;
  if (skip === undefined) skip = 0;

  return { cb, searchQuery, limit, skip, findAll };
};

const find = async (params) => {
  const {
    data: { location, col, conf },
    ...rest
  } = params;

  const { cb, ...queryData } = parseFindParams(rest);

  const query = {
    findItem: true,
    location,
    col,
    ...queryData,
  };

  const res = await connectServer(conf.loc, query);
  if (res.err) return handleErr(cb, 2, res.err);

  if (cb) cb(null, res.items);
  return res.items;
};

const insert = async ({ location, col, conf }, obj, cb) => {
  if (typeof obj === "function" && !cb) return handleErr(obj, 0);
  if (obj && obj._id) return handleErr(cb, 1);

  const apiItem = { _id: nanoid(), ...obj };
  const query = {
    insertItem: true,
    location,
    col,
    apiItem,
  };

  const returnObj = await connectServer(conf.loc, query);
  if (returnObj.err) handleErr(cb, 2, returnObj.err);

  if (cb) cb(null, returnObj.apiItem);
  return returnObj.apiItem;
};

module.exports = { find, insert };
