import React, { useState } from 'react'
import { Application } from '../models'
import { DashboardPage } from './dashboard-page'

export const HomePage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([])

  const onUpdateApps = (newApps: Application[]) => {
    console.log(`On update applications: ${JSON.stringify(newApps, null, 2)}`)
    setApplications(newApps)
  }

  return (
    <DashboardPage
      key={JSON.stringify(applications)}
      applications={applications}
      onUpdateApplications={onUpdateApps}
    />
  )
}
