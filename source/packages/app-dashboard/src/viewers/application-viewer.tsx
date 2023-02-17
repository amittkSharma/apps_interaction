import { RightCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Form, Input, Tooltip } from 'antd'
import React from 'react'
import { Application } from '../models'

interface Props {
  applications: Application[]
  onSendData: (data: Application) => void
}

export const ApplicationsViewer: React.FC<Props> = ({ applications, onSendData }: Props) => {
  const onFinish = (value: Application) => {
    onSendData(value)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return applications.length !== 0 ? (
    <>
      {applications.map(application => {
        const { appId, input, output } = application
        return (
          <Card key={appId} title={`Application ${appId}`} style={{ margin: 8 }}>
            <Form
              name="basic"
              layout="inline"
              initialValues={{ appId, input, output }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="Application Id" name="appId">
                <Input disabled={true} />
              </Form.Item>

              <Form.Item
                label="Input"
                name="input"
                rules={[{ required: true, message: 'Please input the text!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Output" name="output">
                <Input disabled={true} />
              </Form.Item>

              <Form.Item>
                <Tooltip title={`Send information to application ${appId}`} placement="rightBottom">
                  <Button
                    type="primary"
                    htmlType="submit"
                    shape="circle"
                    icon={<RightCircleOutlined />}
                  />
                </Tooltip>
              </Form.Item>
            </Form>
          </Card>
        )
      })}
    </>
  ) : (
    <Alert type="info" description="No applications are connected" />
  )
}
