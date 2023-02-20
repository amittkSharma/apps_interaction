import React, { useState } from 'react'
import { DashboardPage } from './dashboard-page'
import { HelpPage } from './help-page'

export const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  return (
    <>{isLoggedIn ? <DashboardPage /> : <HelpPage onLoginClicked={() => setIsLoggedIn(true)} />}</>
  )
}
