"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDao = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const RequestSchema = new mongoose_1.Schema({
    ipHash: { type: String },
    visitedAt: { type: Date },
});
const RequestModel = mongoose_1.default.model('Request', RequestSchema);
exports.default = RequestModel;
class RequestDao {
    log(ip) {
        let hash5 = (s) => {
            let md5sum = crypto_1.default.createHash('md5');
            return md5sum.update(s).digest('hex').slice(0, 5);
        };
        let req = new RequestModel();
        req.ipHash = hash5(ip);
        req.visitedAt = new Date();
        return req.save();
    }
}
exports.requestDao = new RequestDao();
//# sourceMappingURL=Request.js.map