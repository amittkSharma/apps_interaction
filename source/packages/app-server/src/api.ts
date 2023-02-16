import { Request, Response, Router } from 'express'

export const api: Router = Router()

api.get('/version', getVersion)

function getVersion(_req: Request, res: Response<string>) {
  res.status(200).send(JSON.stringify({ message: '0.1.0' }))
}
