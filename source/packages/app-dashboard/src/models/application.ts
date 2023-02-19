export interface Application {
  appId: string
  input: string
  output: string
}

export interface MessageReceived {
  messageType: string
}

export interface NewAppMessageReceived extends MessageReceived {
  connectedAppIds: string[]
}
