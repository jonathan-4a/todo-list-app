import styled from 'styled-components'
import { useState } from 'react'
import { useListContext } from '../contexts/ListContext'
import { useNavigate } from 'react-router-dom'

// Styled container for the form
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 80px auto;
  padding: 4rem;
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

// Styled button for form submission
const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #f9621a; // Button background color
  color: white; // Text color
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
  font-size: 1.5rem; // Title font size
  color: #444; // Title text color
`

const AddTaskForm = () => {
  const [taskName, setTaskName] = useState('') // State to hold the task name

  const { createNewList } = useListContext() // Hook to access list context
  const navigate = useNavigate() // Hook to programmatically navigate

  // Function to handle form submission
  const submit = (e) => {
    e.preventDefault() // Prevent default form submission behavior
    createNewList(taskName) // Create a new list with the provided name
    setTaskName('') // Reset the task name input
    navigate('/') // Navigate back to the home page
  }

  return (
    <FormContainer>
      <Title>Add Task</Title>
      <form onSubmit={submit}>
        <InputField
          type='text'
          placeholder='Task name'
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)} // Update task name state
          required
          autoFocus
        />
        <Button type='submit'>Add</Button>
      </form>
    </FormContainer>
  )
}

export default AddTaskForm
