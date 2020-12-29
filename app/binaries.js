"use strict";
let path = require("path");
let { rootPath } = require("electron-root-path");
const root = rootPath;
const binariesPath = path.join(root, "./Contents", "./Resources", "./bin");
exports.execPath = path.resolve(path.join(binariesPath, "./m1templib"));
