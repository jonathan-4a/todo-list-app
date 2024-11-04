import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ element, isLoggedIn, path }) => {
  // If user is logged in, render the provided element (protected content)
  // Otherwise, redirect to the specified path or to '/login' by default
  return isLoggedIn ? element : <Navigate to={path ? path : '/login'} />
}

export default ProtectedRoute
