import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Define the base URL for API requests
const REMOTE_URL = 'http://localhost:5000'

const useAuth = () => {
  const [error, setError] = useState(null) // State for storing error messages
  const [isLoggedIn, setIsLoggedIn] = useState(false) // State to track login status
  const navigate = useNavigate()

  useEffect(() => {
    // On mount, check if there's a token in local storage to set the initial login state
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token) // Set isLoggedIn to true if token exists
  }, [])

  // Login function to authenticate user and store token
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${REMOTE_URL}/login`, {
        username,
        password,
      })
      localStorage.setItem('token', response.data.access_token) // Save token on successful login
      setIsLoggedIn(true) // Update login state
      navigate('/') // Redirect to home page
    } catch (err) {
      // Handle login errors and set error message for display
      setError(
        err.response?.data?.message ||
          'The login attempt failed. Please try again later.'
      )
      console.error('Login error:', err)
    }
  }

  // Signup function to register new users
  const signup = async (username, password) => {
    try {
      await axios.post(`${REMOTE_URL}/signup`, { username, password })
      navigate('/login') // Redirect to login page after successful signup
    } catch (err) {
      // Handle signup errors and set error message
      setError(
        err.response?.data?.message ||
          'The signup attempt failed. Please try again later.'
      )
      console.error('Signup error:', err)
    }
  }

  // Logout function to remove token and update login state
  const logout = () => {
    localStorage.removeItem('token') // Clear token from storage
    setIsLoggedIn(false) // Update login state
    navigate('/login') // Redirect to login page
  }

  // Return functions and state variables to be used in components
  return { login, signup, logout, error, isLoggedIn, setError }
}

export default useAuth
