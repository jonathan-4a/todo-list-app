import React, { useEffect, useState } from 'react'
import Sidebar from '../components/SideBar'
import styled from 'styled-components'
import Content from '../components/Content'
import { useListContext } from '../contexts/ListContext'

// Flex container for layout
const Flex = styled.div`
  display: flex;
  flex: 1; // Allows the Flex component to grow and fill available space
`

const Dashboard = () => {
  const { lists, tasks } = useListContext() // Retrieve lists and tasks from context
  const [selectedTask, setSelectedTask] = useState(null) // State to track the currently selected task

  useEffect(() => {
    // Set the first list as the selected task when lists are available
    if (lists.length > 0) {
      setSelectedTask(lists[0])
    }
  }, [lists]) // Dependency array to re-run effect when lists change

  return (
    <Flex>
      <Sidebar
        lists={lists} // Pass the lists to the Sidebar component
        setCurrentTask={setSelectedTask} // Function to update the selected task
        currentTask={selectedTask} // Current selected task
      />
      <Content
        currentTasks={
          tasks.filter((task) => task.list_id === selectedTask?.id) // Filter tasks based on the selected task's ID
        }
        selectedTask={selectedTask} // Pass the selected task to Content
        setSelectedTask={setSelectedTask} // Function to update the selected task
      />
    </Flex>
  )
}

export default Dashboard
