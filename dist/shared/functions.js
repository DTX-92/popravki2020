"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash5 = exports.getRandomInt = exports.pErr = void 0;
const tslib_1 = require("tslib");
const Logger_1 = tslib_1.__importDefault(require("./Logger"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
exports.pErr = (err) => {
    if (err) {
        Logger_1.default.error(err);
    }
};
exports.getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
exports.hash5 = (s) => {
    let md5sum = crypto_1.default.createHash('md5');
    return md5sum.update(s).digest('hex').slice(0, 5);
};
