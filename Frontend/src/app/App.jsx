import React, { useEffect } from 'react'
import AppRoutes from './AppRoutes'
import { useAuth } from './features/auth/hook/useAuth'

const App = () => {
  const auth = useAuth()

  useEffect(()=>{
    auth.handleGetMe()
  },[])
  return (
    <AppRoutes />
  )
}

export default App