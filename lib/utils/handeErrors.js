module.exports = handleErr = (cb, errCode, err) => {
  switch (errCode) {
    case 0:
      if (cb) cb("insert function requires new doc in props", null);
      return "insert function requires new doc in props";
    case 1:
      if (cb) cb("don't put the property '_id' in your query", null);
      return "don't put the property '_id' in your query";
    case 2:
      if (err) {
        if (cb) cb(err, null);
        return err;
      }
    case 3:
      if (cb) cb("first prop should be of type string");
      return "first prop should be of type string";
    case 4:
      if (err) {
        if (cb) cb(err);
        return err;
      }

    case 5:
      if (cb)
        cb(
          "first property of find function should be an object or a callback function",
          null
        );
      return "first property of find function should be an object or a callback function";
  }
};
