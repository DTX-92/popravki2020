"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDao = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const functions_1 = require("@shared/functions");
const RequestSchema = new mongoose_1.Schema({
    ipHash: { type: String },
    visitedAt: { type: Date },
});
const RequestModel = mongoose_1.default.model('Request', RequestSchema);
exports.default = RequestModel;
class RequestDao {
    log(ip) {
        let req = new RequestModel();
        req.ipHash = functions_1.hash5(ip);
        req.visitedAt = new Date();
        return req.save();
    }
}
exports.requestDao = new RequestDao();
