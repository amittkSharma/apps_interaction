import { MessageType } from './enum'

interface BaseMessage {
  messageType: MessageType
}

export interface IncomingMessage extends BaseMessage {
  receivedFrom: string
  sendTo?: string
  message?: string
}

export interface NewConnectionMessage extends BaseMessage {
  connectedAppIds: string[]
}
