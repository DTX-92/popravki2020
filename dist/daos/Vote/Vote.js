"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteDao = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const functions_1 = require("@shared/functions");
const VoteSchema = new mongoose_1.Schema({
    ipHash: { type: String },
    votedAt: { type: Date },
    age: { type: Number },
    result: { type: Number },
    didVote: { type: Boolean },
});
const VoteModel = mongoose_1.default.model('Vote', VoteSchema);
exports.default = VoteModel;
class VoteDao {
    vote(ip, age, result, didVote) {
        let vote = new VoteModel();
        vote.ipHash = functions_1.hash5(ip);
        vote.votedAt = new Date();
        vote.age = age;
        vote.result = result;
        vote.didVote = didVote;
        return vote.save();
    }
}
exports.voteDao = new VoteDao();
