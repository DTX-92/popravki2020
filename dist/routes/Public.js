"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const constants_1 = require("@shared/constants");
const Request_1 = tslib_1.__importDefault(require("@daos/Request/Request"));
const Vote_1 = tslib_1.__importStar(require("@daos/Vote/Vote"));
const router = express_1.Router();
router.get('/requests', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let requests = yield Request_1.default.find().sort({ visitedAt: -1 }).select('-_id -__v');
    return res.json({ requests });
}));
router.get('/votes', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let votes = yield Vote_1.default.find().sort({ votedAt: -1 }).select('-_id -__v');
    return res.json({ votes });
}));
router.get('/vote', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let p = req.query;
    if (!p.age || !p.result || !p.didVote)
        return res.status(404).send(constants_1.paramMissingError);
    let age = +p.age;
    let result = +p.result;
    let didVote = !!+p.didVote;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
    yield Vote_1.voteDao.vote(ip, age, result, didVote);
    return res.send('ok');
}));
router.get('/populate', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    for (let i = 0; i < 100; i++) {
        Vote_1.voteDao.vote('asd', randInt(15, 90), randInt(1, 2), Math.random() > 0.5 ? true : false);
    }
    return res.send('ok');
}));
exports.default = router;
