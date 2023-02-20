import { DashboardOutlined } from '@ant-design/icons'
import { Layout, Space } from 'antd'
import React from 'react'

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

interface Props {
  content: React.ReactNode
  action?: React.ReactNode
}

export const DashboardAppLayout: React.FC<Props> = ({ content, action }) => {
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
          {action && action}
        </Header>
        <Content style={contentStyle}>
          <div style={{ margin: 8 }}>{content}</div>
        </Content>
        <Footer style={footerStyle}>Demo Application</Footer>
      </Layout>
    </Space>
  )
}
