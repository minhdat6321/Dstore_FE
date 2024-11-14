import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Stack } from '@mui/material'
import AdminMainHeader from './AdminMainHeader'
import AdminMainFooter from './AdminMainFooter'
import AlertMsg from '../components/AlertMsg'


function AdminMainLayout() {
  return (
    <Stack sx={{ minHeight: "100vh" }}>
      <AdminMainHeader />
      <AlertMsg />
      <Outlet />

      <Box sx={{ flexGrow: 1 }} />

      <AdminMainFooter />
    </Stack>
  )
}

export default AdminMainLayout