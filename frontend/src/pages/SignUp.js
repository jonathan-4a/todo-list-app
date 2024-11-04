import React from 'react'
import AuthForm from '../components/AuthForm'

const Signup = ({ signup, error, setError }) => {
  // Handle form submission for signing up
  const handleSubmit = (username, password) => {
    signup(username, password) // Call the signup function passed as a prop
  }

  return (
    <AuthForm
      title={'Sign Up'} // Title for the sign-up form
      submitName={'Sign Up'} // Text for the submit button
      error={error} // Error message to display if any
      handleSubmit={handleSubmit} // Function to execute on form submission
      setError={setError} // Function to reset the error state
    />
  )
}

export default Signup
