import mongoose, { Schema, Document } from 'mongoose'
import { hash5 } from '@shared/functions'

const RequestSchema: Schema = new Schema({
   ipHash: { type: String },
   visitedAt: { type: Date },
})

export interface IRequest extends Document {
   ipHash: string
   visitedAt: Date
}

const RequestModel = mongoose.model<IRequest>('Request', RequestSchema)
export default RequestModel

class RequestDao {
   log(ip: string) {
      let req = new RequestModel()
      req.ipHash = hash5(ip)
      req.visitedAt = new Date()

      return req.save()
   }
}

export const requestDao = new RequestDao()
