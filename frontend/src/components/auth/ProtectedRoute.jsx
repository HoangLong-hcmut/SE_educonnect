import React from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  if (!accessToken || !user) {
    return (
      <Navigate
        to='/login'
        replace
      />
    )
  }
  const DEV_BYPASS = false  // <--- bật bypass login lúc dev true là lúc đưa cho product và false là dev

  if (DEV_BYPASS) {
    return <Outlet />
  }

  if (!accessToken) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}

export default ProtectedRoute
