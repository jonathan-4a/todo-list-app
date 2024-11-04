import { createContext, useContext } from 'react'
import useAuth from '../hooks/useAuth'

// Create a context for authentication
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Use custom hook to provide authentication-related values and methods
  const authValues = useAuth()

  return (
    // Pass authentication values to the context provider for access in the component tree
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  )
}

// Custom hook to use authentication context
export const useAuthContext = () => useContext(AuthContext)
