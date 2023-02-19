import { DashboardOutlined, InteractionOutlined } from '@ant-design/icons'
import { Button, Layout, Space } from 'antd'
import React, { useState } from 'react'
import { notifyUser } from '../components'
import { Application, MessageReceived, NewAppMessageReceived } from '../models'
import { ApplicationsViewer } from '../viewers'

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

export const HomePage: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket>()
  const wsUrl = 'ws://localhost:8081'
  const [applications, setApplications] = useState<Application[]>([])
  const applicationId = 'dashboard'

  const connect = () => {
    let ws: WebSocket | undefined = undefined
    if (ws === undefined) {
      ws = new WebSocket(wsUrl)
      setSocket(ws)
    }

    ws.onopen = () => {
      notifyUser(`Connect to server  on url: ${wsUrl}`, 'Success')

      if (ws) {
        const connectionStr = JSON.stringify({
          receivedFrom: applicationId,
          messageType: 'connection',
        })
        ws.send(connectionStr)
      }
    }

    ws.onclose = e => {
      notifyUser(`Closing the ws connection due to ${e}`, 'Error')
    }

    ws.onerror = err => {
      notifyUser(
        `Error encountered on the server ${wsUrl}'. Closing socket due to error: ${err}`,
        'Error',
      )
      if (ws) {
        ws.close()
      }
    }

    ws.onmessage = (messageReceived: MessageEvent) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const parsedMsg = JSON.parse(messageReceived.data)
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
          console.log(`New message is received`)
        }
      } else {
        notifyUser(`Unable to receive the data on server: ${wsUrl}`, 'Error')
      }
    }
  }

  const onHandleSendData = (data: Application) => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      const sendData = {
        messageType: 'message',
        receivedFrom: applicationId,
        sendTo: data.appId,
        msg: data.input,
      }

      socket.send(JSON.stringify(sendData))
    } else {
      notifyUser(`Not able to send the data to the server`, 'Error')
    }
  }

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
          <Button type="primary" shape="circle" icon={<InteractionOutlined />} onClick={connect} />
        </Header>
        <Content style={contentStyle}>
          <div style={{ margin: 8 }}>
            <ApplicationsViewer applications={applications} onSendData={onHandleSendData} />
          </div>
        </Content>
        <Footer style={footerStyle}>Demo Application</Footer>
      </Layout>
    </Space>
  )
}
