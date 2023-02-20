import { DashboardOutlined, InteractionOutlined } from '@ant-design/icons'
import { Alert, Button, Layout, Space } from 'antd'
import React, { useState } from 'react'
import { Application, MessageReceived, NewAppMessageReceived, RealMessage } from '../models'
import { ApplicationsViewer } from '../viewers'
import { WsConnectionProvider } from './ws-connection-provider'

const { Header, Footer, Content } = Layout

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'left',
  minHeight: '87vh',
  lineHeight: '120px',
  backgroundColor: '#108ee9',
}

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: '#7dbcea',
}

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

    if (msgReceived.messageType === 'newApps') {
      const newAppsReceivedMsg: NewAppMessageReceived = parsedMsg
      const existingApps = applications.map(x => x)
      newAppsReceivedMsg.connectedAppIds.forEach(appId => {
        const index = existingApps.findIndex(app => app.appId === appId)
        if (index === -1) {
          existingApps.push({ appId, input: '', output: '' })
        }
      })
      setApplications(existingApps)
    } else if (msgReceived.messageType === 'message') {
      const realReceivedMsg: RealMessage = parsedMsg
      const { receivedFrom, message } = realReceivedMsg
      const existingApps = applications.map(x => x)
      if (receivedFrom.toLowerCase() === 'dashboard') {
        console.log(`Do not update me I am in the sender ${applications.length}`)
      } else {
        const app = existingApps.find(x => x.appId.toLowerCase() === receivedFrom.toLowerCase())
        if (app) {
          app.output = message
        }

        setApplications(existingApps)
      }
    }
  }

  const onHandleMakeConnection = (
    sendRequest: (
      data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView | undefined,
    ) => void,
  ) => {
    const connectionStr = JSON.stringify({
      receivedFrom: applicationId,
      messageType: 'connection',
    })
    sendRequest(connectionStr)
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
        console.log(response, readyState)
        if (response === undefined) {
          return <Alert message="Messages are not received from server" type="error" />
        } else {
          console.log(JSON.stringify(response, null, 2))
          transformMessage(response)

          return (
            <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
              <Layout>
                <Header style={headerStyle}>
                  <DashboardOutlined
                    style={{
                      fontSize: 40,
                    }}
                  />
                  Application Communication Dashboard
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<InteractionOutlined />}
                    onClick={() => onHandleMakeConnection(sendRequest)}
                  />
                </Header>
                <Content style={contentStyle}>
                  <div style={{ margin: 8 }}>
                    <ApplicationsViewer
                      key={JSON.stringify(applications)}
                      applications={applications}
                      onSendData={data => onHandleSendData(data, sendRequest)}
                    />
                  </div>
                </Content>
                <Footer style={footerStyle}>Demo Application</Footer>
              </Layout>
            </Space>
          )
        }
      }}
    </WsConnectionProvider>
  )
}
