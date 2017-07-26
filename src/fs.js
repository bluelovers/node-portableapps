/**
 * Created by user on 2017/7/27/027.
 */

'use strict';

const util = require('util');
const fs = require('fs-extra');

fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);
fs.stat = util.promisify(fs.stat);
fs.rename = util.promisify(fs.rename);

module.exports.fs = fs;

const fswin = require('fswin');
const winattr = require('winattr');

winattr.get = util.promisify(winattr.get);
winattr.set = util.promisify(winattr.set);

module.exports.winattr = winattr;
