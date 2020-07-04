import mongoose, { Schema, Document } from 'mongoose'
import { hash5 } from '@src/shared/functions'

const VoteSchema: Schema = new Schema({
   ipHash: { type: String },
   votedAt: { type: Date },
   age: { type: Number },
   result: { type: Number }, //1 - yes, 2 - no
   didVote: { type: Boolean },
})

export interface IVote extends Document {
   ipHash: string
   votedAt: Date
   age: Number
   result: Number
   didVote: Boolean
}

const VoteModel = mongoose.model<IVote>('Vote', VoteSchema)
export default VoteModel

class VoteDao {
   vote(ip: string, age: number, result: number, didVote: boolean) {
      let vote = new VoteModel()
      vote.ipHash = hash5(ip)
      vote.votedAt = new Date()
      vote.age = age
      vote.result = result
      vote.didVote = didVote

      return vote.save()
   }
}

export const voteDao = new VoteDao()
