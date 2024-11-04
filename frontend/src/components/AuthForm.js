import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

// AuthForm component for user authentication (login/signup)
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0.5px 4px rgba(0, 0, 0, 0.1);
  background: #fffffff0;
  text-align: center;
  font-size: 0.9rem;
`

const InputField = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 0.6px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  color: #555;
`

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #f9621a; // Primary button color
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #ff771d; // Change color on hover
  }
`

const Title = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #444;
`

const Error = styled.div`
  color: red; // Error message styling
  margin-top: 1rem;
`

const P = styled.p`
  margin-top: 2rem;
  color: #555;
`

const AuthForm = ({ title, handleSubmit, submitName, error, setError }) => {
  const [username, setUsername] = useState('') // State for username input
  const [password, setPassword] = useState('') // State for password input
  const location = useLocation() // Hook to access current location for error handling

  // Reset error message when the component mounts or location changes
  useEffect(() => {
    setError('')
  }, [location, setError])

  // Handle form submission
  const submit = (e) => {
    e.preventDefault() // Prevent default form submission behavior
    handleSubmit(username, password) // Call the handleSubmit function with input values
  }

  return (
    <FormContainer>
      <Title>{title}</Title>
      <form onSubmit={submit}>
        <InputField
          type='text'
          placeholder='username' // Placeholder text for username input
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state on change
          required
        />
        <InputField
          type='password'
          placeholder='password' // Placeholder text for password input
          onChange={(e) => setPassword(e.target.value)} // Update password state on change
          required
          value={password}
        />
        <Button type='submit'>{submitName}</Button>{' '}
        {/* Button to submit the form */}
      </form>
      {error && <Error>{error}</Error>} {/* Display error message if exists */}
      {title === 'Log In' ? (
        <P>
          Don't have an account? <Link to={'/signup'}>Create Account</Link>
        </P>
      ) : (
        <P>
          Already have an account, <Link to='/login'>Sign In</Link>
        </P>
      )}
    </FormContainer>
  )
}

export default AuthForm
