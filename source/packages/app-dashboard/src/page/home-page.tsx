import React, { useState } from 'react'
import { Application } from '../models'
import { DashboardPage } from './dashboard-page'

export const HomePage: React.FC = () => {
  const wsUrl = 'ws://localhost:8081'
  const ws: WebSocket = new WebSocket(wsUrl)
  const [applications, setApplications] = useState<Application[]>([])

  const onUpdateApps = (newApps: Application[]) => {
    console.log(`On update applications: ${JSON.stringify(newApps, null, 2)}`)
    console.log(`ws: ${JSON.stringify(ws.readyState === WebSocket.CLOSED, null, 2)}`)
    setApplications(newApps)
  }

  return (
    <DashboardPage
      key={JSON.stringify(applications)}
      ws={ws}
      applications={applications}
      onUpdateApplications={onUpdateApps}
    />
  )
}
