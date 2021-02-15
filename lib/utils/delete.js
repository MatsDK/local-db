const handleErr = require("./handeErrors");
const connectServer = require("./connect");

const deleteLocation = async (conf, name, cb) => {
  if (typeof name !== "string") return handleErr(cb, 3);

  const query = { deleteLocation: true, name };
  const res = await connectServer(conf.loc, query);

  if (res.err) handleErr(cb, 4, res.err);

  if (cb) cb(null);
  return { conf, name, cb };
};

const deleteCollection = async (conf, location, name, cb) => {
  if (typeof name !== "string") return handleErr(cb, 3);

  const query = { deleteCollection: true, location, name };
  const res = await connectServer(conf.loc, query);

  if (res.err) handleErr(cb, 4, res.err);

  if (cb) cb(null);
  return null;
};

module.exports = { deleteLocation, deleteCollection };
