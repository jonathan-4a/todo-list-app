import React from 'react'
import styled from 'styled-components'
import { useListContext } from '../contexts/ListContext'

// Container styling for each task item
const TaskItemContainer = styled.div`
  padding: 10px 15px;
  margin: 4px 0;
  border-radius: 7px;
  font-size: 0.78rem;
  cursor: pointer;
  font-family: Poppins;
  font-weight: 300;

  &:hover {
    background-color: #aaa;
  }
`

function TaskItem({ task, setCurrentTask, activeTask }) {
  const { dragSourceTask, onMoveTask } = useListContext()

  // Handles the drop action for drag-and-drop functionality
  const handleDrop = (e) => {
    e.preventDefault()
    onMoveTask(dragSourceTask.current, task.id)
  }

  return (
    <TaskItemContainer
      onDrop={handleDrop} // Allow dropping of dragged items
      onDragOver={(e) => e.preventDefault()} // Enable drag-over effect
      style={
        activeTask
          ? { background: '#ED804A', color: 'white' } // Highlight active task
          : { color: '#666', backgroundColor: '#f4f4f4' }
      }
      onClick={() => setCurrentTask(task)} // Set current task on click
    >
      {task.name}
    </TaskItemContainer>
  )
}

export default TaskItem
