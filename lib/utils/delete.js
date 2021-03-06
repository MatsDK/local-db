const handleErr = require("./handeErrors");
const connectServer = require("./connect");
const { parseParams } = require("./parseParams");

const deleteLocation = async (conf, name, cb) => {
  if (typeof name !== "string") return handleErr(cb, 3);

  const query = { deleteLocation: true, name };
  const res = await connectServer(conf.loc, query);

  if (res.err) handleErr(cb, 4, res.err);

  if (cb) cb(null);
  return { conf, name, cb };
};

const deleteCollection = async (conf, location, { deleteAll }, name, cb) => {
  if (!deleteAll) {
    if (typeof name !== "string") return handleErr(cb, 3);

    const query = { deleteCollection: true, location, name, deleteAll: false };
    const res = await connectServer(conf.loc, query);

    if (res.err) handleErr(cb, 4, res.err);
  } else {
    if (name && typeof name !== "function") return handleErr(cb, 14);

    const query = { deleteCollection: true, location, deleteAll: true };
    const res = await connectServer(conf.loc, query);

    if (res.err) handleErr(cb, 4, res.err);
  }

  if (cb) cb(null);
  return null;
};

const findAndDelete = async (params) => {
  const {
    data: { location, col, conf },
    ...rest
  } = params;
  const { cb, ...queryData } = parseParams(rest);

  const query = {
    findAndDelete: true,
    location,
    col,
    ...queryData,
  };

  const res = await connectServer(conf.loc, query);
  if (res.err) handleErr(cb, 4, res.err);

  if (cb) cb(null);
  return null;
};
module.exports = { deleteLocation, deleteCollection, findAndDelete };
