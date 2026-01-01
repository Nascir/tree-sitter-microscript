const path = require("path");
const root = path.join(__dirname, "..", "..");

module.exports = require("node-gyp-build")(root);
