import * as compression from 'compression'
import * as cors from 'cors'
import * as express from 'express'
import { Express } from 'express'
import { api } from './api'

export const app: Express = express()

app.disable('etag').disable('x-powered-by')

app.use(cors())
app.use(compression())
app.use(express.json({ limit: '20mb' }))

app.use('/api', api)
