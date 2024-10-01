import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../../context/AuthContext'

const Protected = ({ children }) => {
  const { user, dbUser } = UserAuth()
  if (!user && dbUser !== null) {
    return <Navigate to="/" />
  }

  return children
}

export default Protected
