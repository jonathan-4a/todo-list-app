import AuthForm from '../components/AuthForm'

const Login = ({ error, setError, login }) => {
  // Handle form submission
  const handleSubmit = async (username, password) => {
    login(username, password) // Call the login function passed as a prop
  }

  return (
    <AuthForm
      title={'Log In'} // Title of the form
      submitName={'Login'} // Text for the submit button
      handleSubmit={handleSubmit} // Function to call on form submission
      error={error} // Error message to display if applicable
      setError={setError} // Function to reset the error state
    />
  )
}

export default Login
