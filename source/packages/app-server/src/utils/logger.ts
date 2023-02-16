import { pino } from 'pino'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pino-pretty')

const stream = pretty({
  colorize: true,
  translateTime: true,
})
export const log = pino(stream)
