"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const Public_1 = tslib_1.__importDefault(require("./Public"));
const router = express_1.Router();
router.use("/public", Public_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map