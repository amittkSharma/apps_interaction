import { AlertOutlined, DashboardOutlined } from '@ant-design/icons'
import { Alert, Layout, Space, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Application, MessageReceived, NewAppMessageReceived, RealMessage } from '../models'
import { WsConnectionProvider } from '../providers'
import { ApplicationsViewer } from '../viewers'

const { Header, Footer, Content } = Layout

const headerStyle: React.CSSProperties = {
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
            <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
              <Layout>
                <Header style={headerStyle}>
                  <DashboardOutlined
                    style={{
                      fontSize: 40,
                      marginRight: 20,
                    }}
                  />
                  <p style={{ fontSize: 32 }}>Application Communication Dashboard</p>
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
