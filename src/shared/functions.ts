import logger from './Logger'
import crypto from 'crypto'

export const pErr = (err: Error) => {
   if (err) {
      logger.error(err)
   }
}

export const getRandomInt = () => {
   return Math.floor(Math.random() * 1_000_000_000_000)
}

export const hash5 = (s: string) => {
   let md5sum = crypto.createHash('md5')
   return md5sum.update(s).digest('hex').slice(0, 5)
}
