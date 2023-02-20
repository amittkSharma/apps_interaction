import * as http from 'http'
import { WebSocket } from 'ws'
import { app } from './app'
import { config } from './config'
import { log } from './utils'

enum MessageType {
  CONNECTION = 'connection',
  NEW_APPLICATIONS = 'newApps',
  MESSAGE = 'message',
  DISCONNECTED = 'disconnected',
}

enum ApplicationType {
  CLIENT = 'client',
  DASHBOARD = 'dashboard',
}

interface BaseMessage {
  messageType: MessageType
}

interface IncomingMessage extends BaseMessage {
  receivedFrom: string
  sendTo?: string
  message?: string
}

interface NewConnectionMessage extends BaseMessage {
  connectedAppIds: string[]
}

const server = http.createServer(app)
const wsServer = new WebSocket.Server({ server })

const connectedApps: string[] = []

server.listen(config.server.port, () => {
  log.info(`Server started at port: ${config.server.port}`)
})

wsServer.on('connection', function (ws) {
  ws.on('message', msg => {
    const incomingMsg: IncomingMessage = JSON.parse(msg.toString())
    const { messageType, receivedFrom } = incomingMsg

    if (messageType === MessageType.CONNECTION) {
      if (connectedApps.indexOf(receivedFrom) === -1) {
        log.info(`Adding new client to sever: ${receivedFrom}`)
        connectedApps.push(receivedFrom)
        let newConnectionMsg: NewConnectionMessage = {
          messageType: MessageType.NEW_APPLICATIONS,
          connectedAppIds: [],
        }
        if (receivedFrom === ApplicationType.DASHBOARD) {
          newConnectionMsg = {
            ...newConnectionMsg,
            connectedAppIds: connectedApps.filter(
              x => x.toLowerCase() !== ApplicationType.DASHBOARD.toLowerCase(),
            )
          }

        } else {
          newConnectionMsg = {
            ...newConnectionMsg,
            connectedAppIds: [receivedFrom]
          }
        }
        log.info(`sending apps on the socket ${JSON.stringify(newConnectionMsg, null, 2)}`)

        // ws.send(JSON.stringify(newConnectionMsg))
        wsServer.clients.forEach(client => {
          log.info(client.readyState)
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newConnectionMsg))
          }
        })
      } else {
        log.warn(`${receivedFrom} is already connected to the server`)
      }
    } else {
      log.info(`in else part ${JSON.stringify(incomingMsg, null, 2)}`)
      // ws.send(JSON.stringify(incomingMsg))
      wsServer.clients.forEach(client => {
        log.info(client.readyState)
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(incomingMsg))
        }
      })
    }
  })
})
