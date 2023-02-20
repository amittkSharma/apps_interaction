export interface MessageReceived {
  messageType: string
}

export interface NewAppMessageReceived extends MessageReceived {
  connectedAppIds: string[]
}

export interface RealMessage extends MessageReceived {
  receivedFrom: string
  sendTo: string
  message: string
}
