const seed = require("./seed");
const db = require("../connection");
const devData = require("../data/development-data/index");

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
