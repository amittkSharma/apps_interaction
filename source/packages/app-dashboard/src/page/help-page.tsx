import { LoginOutlined } from '@ant-design/icons'
import { Card, Tooltip } from 'antd'
import React from 'react'
import { DashboardAppLayout } from 'src/components'

interface Props {
  onLoginClicked: () => void
}

export const HelpPage: React.FC<Props> = ({ onLoginClicked }: Props) => {
  return (
    <DashboardAppLayout
      content={
        <Card title="ReadMe: Application Communication Dashboard" style={{ margin: 8 }}>
          <h4>Introduction</h4>
          <p>
            Application Communication Dashboard is an application where various windows application
            can get connected, and pass messages back and forth. The Dashboard (web-application) is
            able to display all the connected windows applications and can send data to them,
            similarly windows applications can send data to dashboard. Both dashboard and window
            applications get connected to Nodejs server
          </p>
          <h4>Technical Stack</h4>
          <ul>
            <li>Server Stack: NodeJS, Typescript, Websocket</li>
            <li>Web Application Stack: ReactJS, Typescript, Antd (UI Framework)</li>
            <li>Windows Technology App: C#, XAML</li>
            <li>IDE(s): Visual Studio 2017, Visual Studio Code</li>
            <li>Browser: Google Chrome</li>
          </ul>

          <h4>How To Build & Run Application</h4>
          <ol>
            <li>
              <u>Pre-requisite</u>: Visual Studio Code, Visual Studio 2017, NodeJS, .NET framework,
              GIT, Google Chrome browser are already installed on the target machine
            </li>
            <li>
              <u>Clone repository</u>: <b>https://github.com/amittkSharma/apps_interaction.git</b>
            </li>
            <li>
              <u>Package Installation</u>: Open the source code in Visual Studio Code, and open the
              terminal window, navigate to the source folder. And execute command <b>npm install</b>
              . Due to monorepo concept packages for both dashboard and server will be installed in
              one go. If there is a problem please check the troubleshooting section below.
            </li>
            <li>
              <u>Server Startup</u>: Open another terminal window, navigate to the app-server and
              execute the command in the same sequence to build and start the nodejs server:{' '}
              <b>npm run build</b> and
              <b>npm run start</b>
            </li>
            <li>After the execution of commands in step 4, server will start up at port 8081</li>
            <li>
              <u>Fire-up Dashboard</u>: Open another terminal window, navigate to the app-dashboard
              and execute the command to launch the dashboard(web application) <b>npm run start</b>
            </li>
            <li>
              After the execution of commands in step 6, the dashboard application will be launched
              in the chrome browser at <b>http://localhost:3000/</b>
            </li>
            <li>
              <u>Launch Window Applications</u>: In order to launch the window applications, there
              is no need to build any solution. There is an executable present at:
              <b>app-client/app-client/bin/debug/app-client.exe</b>. Double click on
              <u>app-client.exe</u> a window application will launch. Every time executable is is
              double clicked a new instance of the window application will start having a unique
              process id.
            </li>
            <li>
              <b>CONGRATULATIONS</b> :) all the components of the system are up and running.
            </li>
          </ol>
          <h4>Application Walk Through</h4>
          <ol>
            <li>
              Once the dashboard application is launched in the browser, <b>README</b> is first
              landing page. In order to navigate to the dashboard click the <u>login</u> icon
              present in top right hand corner. At this moment dashboard will be showing an alert
              message <b>No applications are connected.</b>
            </li>
            <li>
              In order to launch windows applications follow the step 8{' '}
              <u>Launch Window Applications</u>. Once the window application is launched, click the{' '}
              <b>Connect</b> button. This will connect the windows application to the server. Once
              this is done the dashboard will start displaying the connected window applications.
              N-number of window applications can be connected.
            </li>
            <li>
              The is a <b>Send Message</b> button in both dashboard and windows application to pass
              the message between the dashboard and specific window application. The input field
              from the dashboard will appear in the output field of the window application, same
              will happen when message is send in other direction
            </li>
          </ol>
          <h4>Assumptions</h4>
          <ol>
            <li>
              This is a system where only 1 dashboard application can get connected to server,
              whereas N windows applications can get connected to the server
            </li>
            <li>
              Dashboard gets automatically connected to the running server, where as windows
              application need to be connected manually
            </li>
            <li>
              Window applications can not able to send the messages to each other, communication
              between dashboard and specific window application is possible
            </li>
          </ol>
          <h4>Troubleshooting Guide</h4>
          <ul>
            <li>
              If the <b>Package Installation</b> step does not work, then please navigate to the
              specific folders <b>app-server</b>, <b>app-dashboard</b> and execute {''}
              <b>npm install</b> command inside those folders
            </li>
          </ul>
          <h4>Missing Features</h4>
          <ol>
            <li>
              Closing of windows applications is not communicated to server, hence the dashboard
              will show the application
            </li>
          </ol>
        </Card>
      }
      action={
        <Tooltip title="Dashboard" placement="leftBottom">
          <LoginOutlined
            style={{
              fontSize: 40,
              marginRight: 20,
            }}
            onClick={onLoginClicked}
          />
        </Tooltip>
      }
    />
  )
}
