const connectServer = require("./connect");
const handleErr = require("./handeErrors");
const { parseParams, parseUpdateParams } = require("./parseParams");

const find = async (params) => {
  const {
    data: { location, col, conf },
    ...rest
  } = params;

  const { cb, ...queryData } = parseParams(rest);

  const query = {
    findItem: true,
    location,
    col,
    ...queryData,
  };

  const res = await connectServer(conf.loc, query);
  if (res.err) return handleErr(cb, 2, res.err);

  if (cb) cb(null, params.limit ? res.items[0] : res.items);
  return params.limit ? res.items[0] : res.items;
};

const insert = async ({ location, col, conf }, obj, { limit }, cb) => {
  if (Array.isArray(obj) && limit === 1) return handleErr(cb, 12);
  if (limit !== 1 && !Array.isArray(obj)) return handleErr(cb, 13);
  if (typeof cb !== "function") return handleErr(cb, 11);

  if (limit === 1 && obj.hasOwnProperty("_id")) return handleErr(cb, 10);
  else if (limit === undefined)
    obj.forEach((element) => {
      if (element.hasOwnProperty("_id")) return handleErr(cb, 10);
    });

  const query = {
    insertItem: true,
    location,
    col,
    obj,
    isArray: limit !== 1,
  };

  const res = await connectServer(conf.loc, query);

  if (res.err) handleErr(cb, 2, res.err);
  if (cb) cb(null, res.items);
  return res.items;
};

const update = async (params) => {
  const {
    data: { location, col, conf },
    ...rest
  } = params;

  const { cb, ...queryData } = parseUpdateParams(rest);

  const query = {
    update: true,
    location,
    col,
    ...queryData,
  };

  const res = await connectServer(conf.loc, query);
  if (res.err) handleErr(cb, 4, res.err);

  if (cb) cb(null, res.returnArr);
  return res.returnArr;
};

module.exports = { find, insert, update };
