import { Request, Response, Router } from 'express'
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes'
import { ParamsDictionary } from 'express-serve-static-core'

import { paramMissingError } from '@shared/constants'

import RequestModel from '@daos/Request/Request'
import VoteModel, { voteDao } from '@daos/Vote/Vote'
import crypto from 'crypto'

// Init shared
const router = Router()

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/requests', async (req: Request, res: Response) => {
   let requests = await RequestModel.find().sort({ visitedAt: -1 }).select('-_id -__v')
   return res.json({ requests })
})
router.get('/votes', async (req: Request, res: Response) => {
   let votes = await VoteModel.find().sort({ votedAt: -1 }).select('-_id -__v')
   return res.json({ votes })
})

// router.get('/add', async (reqE: Request, res: Response) => {
//    return res.json({ status: 'OK' })
// })

router.get('/vote', async (req: Request, res: Response) => {
   let p = req.query
   if (!p.age || !p.result || !p.didVote) return res.status(404).send(paramMissingError)

   let age = +p.age
   let result = +p.result
   let didVote = !!+p.didVote

   let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress) as string
   await voteDao.vote(ip, age, result, didVote)
   return res.send('ok')
})

router.get('/populate', async (req: Request, res: Response) => {
   const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
   for (let i = 0; i < 100; i++) {
      voteDao.vote('asd', randInt(15, 90), randInt(1, 2), Math.random() > 0.5 ? true : false)
   }

   return res.send('ok')
})

export default router
