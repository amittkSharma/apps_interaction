import * as http from 'http'
import { WebSocket } from 'ws'
import { app } from './app'
import { config } from './config'
import { ApplicationType, IncomingMessage, MessageType, NewConnectionMessage } from './models'
import { log } from './utils'

const server = http.createServer(app)
const wsServer = new WebSocket.Server({ server })

const connectedApps: string[] = []

server.listen(config.server.port, () => {
  log.info(`Server started at port: ${config.server.port}`)
})

wsServer.on('connection', function (ws) {
  const serverReached: NewConnectionMessage = {
    messageType: MessageType.CONNECTION,
    connectedAppIds: [],
  }
  ws.send(JSON.stringify(serverReached))

  ws.on('message', msg => {
    const incomingMsg: IncomingMessage = JSON.parse(msg.toString())
    const { messageType, receivedFrom } = incomingMsg

    if (messageType === MessageType.CONNECTION) {
      if (connectedApps.indexOf(receivedFrom) === -1) {
        connectedApps.push(receivedFrom)
        log.info(`New app is connected to the server: ${receivedFrom}`)
        let newConnectionMsg: NewConnectionMessage = {
          messageType: MessageType.NEW_APPLICATIONS,
          connectedAppIds: [],
        }
        if (receivedFrom === ApplicationType.DASHBOARD) {
          newConnectionMsg = {
            ...newConnectionMsg,
            connectedAppIds: connectedApps.filter(
              x => x.toLowerCase() !== ApplicationType.DASHBOARD.toLowerCase(),
            ),
          }
        } else {
          newConnectionMsg = {
            ...newConnectionMsg,
            connectedAppIds: [receivedFrom],
          }
        }
        log.info(`sending apps on the socket ${JSON.stringify(newConnectionMsg, null, 2)}`)
        wsServer.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newConnectionMsg))
          }
        })
      } else {
        log.warn(`${receivedFrom} is already connected to the server`)
      }
    } else {
      log.info(`Message received ${JSON.stringify(incomingMsg, null, 2)}`)
      wsServer.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(incomingMsg))
        }
      })
    }
  })
})
