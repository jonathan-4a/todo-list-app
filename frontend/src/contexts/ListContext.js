import { createContext, useContext } from 'react'
import useList from '../hooks/useList'

// Create a context for task list management
const ListContext = createContext()

export const ListProvider = ({ children }) => {
  // Get list-related values and methods from custom hook
  const listValues = useList()

  return (
    // Provide list values to the context provider for access throughout the component tree
    <ListContext.Provider value={listValues}>{children}</ListContext.Provider>
  )
}

// Custom hook to access list context
export const useListContext = () => useContext(ListContext)
