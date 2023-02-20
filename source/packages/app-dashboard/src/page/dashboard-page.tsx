import { DashboardOutlined, InteractionOutlined } from '@ant-design/icons'
import { Button, Layout, Space } from 'antd'
import React from 'react'
import { notifyUser } from '../components'
import { Application, MessageReceived, NewAppMessageReceived, RealMessage } from '../models'
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

interface Props {
  applications: Application[]
  ws: WebSocket
  onUpdateApplications: (applications: Application[]) => void
}

export const DashboardPage: React.FC<Props> = ({
  ws,
  applications,
  onUpdateApplications,
}: Props) => {
  const applicationId = 'dashboard'

  const connect = () => {
    ws.onopen = () => {
      notifyUser(`Connect to server  on url: ${ws.url}`, 'Success')

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
        `Error encountered on the server ${ws.url}'. Closing socket due to error: ${err}`,
        'Error',
      )
      if (ws) {
        ws.close()
      }
    }

    ws.onmessage = (messageReceived: MessageEvent) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        transformMessage(messageReceived.data)
      } else {
        notifyUser(`Unable to receive the data on server: ${ws.url}`, 'Error')
      }
    }
  }

  const onHandleSendData = (data: Application) => {
    if (ws && ws.readyState !== WebSocket.CLOSED) {
      const sendMsg: RealMessage = {
        messageType: 'message',
        receivedFrom: applicationId,
        sendTo: data.appId,
        message: data.input,
      }

      ws.send(JSON.stringify(sendMsg))
    } else {
      notifyUser(`Not able to send the message to the server`, 'Error')
    }
  }

  const transformMessage = (msg: string) => {
    const parsedMsg = JSON.parse(msg)
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
      onUpdateApplications(existingApps)
    } else if (msgReceived.messageType === 'message') {
      const realReceivedMsg: RealMessage = parsedMsg
      const { receivedFrom, sendTo, message } = realReceivedMsg
      const existingApps = applications.map(x => x)
      if (receivedFrom.toLowerCase() === 'dashboard') {
        console.log(`Do not update me I am in the sender ${applications.length}`)
      } else {
        const app = existingApps.find(x => x.appId.toLowerCase() === sendTo.toLowerCase())
        if (app) {
          app.output = message
        }

        onUpdateApplications(existingApps)
      }
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
