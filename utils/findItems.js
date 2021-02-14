module.exports = filterItems = (items, req) => {
  if (!req.findAll) {
    const returnArr = [];

    for (let i = 0; i < items.length; i++) {
      const keys = Object.keys(req.searchQuery).map((x) => [
        x,
        req.searchQuery[x],
      ]);

      let isValid = true;
      keys.forEach((x) => {
        if (items[i][x[0]] !== x[1]) {
          isValid = false;
        }
      });

      if (isValid) returnArr.push(items[i]);
    }

    if (req.limit) returnArr.length = req.limit;
    return returnArr;
  } else {
    if (req.skip) items.splice(0, req.skip).length;
    if (req.limit) items.length = req.limit;
    return items;
  }
};
