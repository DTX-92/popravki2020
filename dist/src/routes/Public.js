"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const Request_1 = tslib_1.__importDefault(require("@src/daos/Request/Request"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const router = express_1.Router();
router.get('/get', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let requests = yield Request_1.default.find();
    return res.json({ requests });
}));
router.get('/add', (reqE, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let req = new Request_1.default();
    req.ipHash = Math.random().toString();
    yield req.save();
    return res.json({ status: 'OK' });
}));
router.get('/test', (req, res2) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    let hash5 = (s) => {
        let md5sum = crypto_1.default.createHash('md5');
        return md5sum.update(s).digest('hex').slice(0, 5);
    };
    ip = hash5(ip);
    return res2.send(ip);
}));
exports.default = router;
//# sourceMappingURL=Public.js.map