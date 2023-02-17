import * as http from 'http'
import { WebSocket } from 'ws'
import { app } from './app'
import { config } from './config'
import { log } from './utils'

enum MessageType {
  CONNECTION = 'connection',
  MESSAGE = 'message',
}

interface IncomingData {
  messageType: MessageType
  receivedFrom: string
  sendTo?: string
  message?: string
}

const server = http.createServer(app)
const wsServer = new WebSocket.Server({ server })

const connectedApps: string[] = []

server.listen(config.server.port, () => {
  log.info(`Server started at port: ${config.server.port}`)
})

wsServer.on('connection', function (ws) {
  ws.on('message', msg => {
    const incomingData: IncomingData = JSON.parse(msg.toString())
    log.info(
      `Sending message back ${JSON.stringify(incomingData)}, ${
        incomingData.messageType === MessageType.CONNECTION
      }, ${connectedApps.indexOf(incomingData.receivedFrom) === -1}`,
    )
    if (incomingData.messageType === MessageType.CONNECTION) {
      if (connectedApps.indexOf(incomingData.receivedFrom) === -1) {
        connectedApps.push(incomingData.receivedFrom)
        log.info(`Adding new client to sever: ${incomingData.receivedFrom}`)
        ws.send(`${incomingData.receivedFrom} is successfully connected to the server`)
      } else {
        log.warn(`${incomingData.receivedFrom} is already connected to the server`)
      }
    } else {
      log.info(`in else part ${JSON.stringify(incomingData, null, 2)}`)
      ws.send(JSON.stringify(incomingData))
    }
    // log.info(``)
    // wsServer.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     // check if client is ready
    //     client.send(msg.toString())
    //   }
    // })
  })
})
