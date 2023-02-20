import { AlertOutlined } from '@ant-design/icons'
import { Alert, Tooltip } from 'antd'
import React, { useState } from 'react'
import { DashboardAppLayout } from '../components'
import { Application, MessageReceived, NewAppMessageReceived, RealMessage } from '../models'
import { WsConnectionProvider } from '../providers'
import { ApplicationsViewer } from '../viewers'

export const DashboardPage: React.FC = () => {
  const applicationId = 'dashboard'
  const [applications, setApplications] = useState<Application[]>([])

  const onHandleSendData = (
    data: Application,
    sendRequest: (
      data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView | undefined,
    ) => void,
  ) => {
    const sendMsg: RealMessage = {
      messageType: 'message',
      receivedFrom: applicationId,
      sendTo: data.appId,
      message: data.input,
    }

    sendRequest(JSON.stringify(sendMsg))
  }

  const transformMessage = (msg: string) => {
    const parsedMsg = JSON.parse(JSON.stringify(msg))
    const msgReceived: MessageReceived = parsedMsg
    const existingApps = applications.map(x => x)

    if (msgReceived.messageType === 'newApps') {
      const newAppsReceivedMsg: NewAppMessageReceived = parsedMsg
      newAppsReceivedMsg.connectedAppIds.forEach(appId => {
        const index = existingApps.findIndex(app => app.appId === appId)
        if (index === -1) {
          existingApps.push({ appId, input: '', output: '' })
        }
      })
    } else if (msgReceived.messageType === 'message') {
      const realReceivedMsg: RealMessage = parsedMsg
      const { receivedFrom, message } = realReceivedMsg
      if (receivedFrom.toLowerCase() === applicationId) {
        console.log(`Do not update me I am in the sender ${applications.length}`)
      } else {
        const app = existingApps.find(x => x.appId.toLowerCase() === receivedFrom.toLowerCase())
        if (app) {
          app.output = message
        }
      }
    }
    setApplications(existingApps)
  }

  return (
    <WsConnectionProvider>
      {(
        response: string,
        sendRequest: (
          data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView | undefined,
        ) => void,
        readyState: number,
      ) => {
        if (response === undefined) {
          return <Alert message="Messages are not received from server" type="error" />
        } else {
          transformMessage(response)
          return (
            <DashboardAppLayout
              content={
                <ApplicationsViewer
                  key={JSON.stringify(applications)}
                  applications={applications}
                  onSendData={data => onHandleSendData(data, sendRequest)}
                />
              }
              action={
                <Tooltip
                  title={readyState === 1 ? 'Connected' : 'Not Connected'}
                  placement="leftBottom"
                >
                  <AlertOutlined
                    style={{
                      fontSize: 40,
                      marginRight: 20,
                      color: readyState === 1 ? 'green' : 'red',
                    }}
                  />
                </Tooltip>
              }
            />
          )
        }
      }}
    </WsConnectionProvider>
  )
}
