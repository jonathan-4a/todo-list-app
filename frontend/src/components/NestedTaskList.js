import React, { useState } from 'react'
import styled from 'styled-components'
import { TbEdit } from 'react-icons/tb'
import { MdDeleteOutline } from 'react-icons/md'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { IoAddCircleSharp } from 'react-icons/io5'

import { useListContext } from '../contexts/ListContext'

// Styled components for the layout and design of the subtasks
const SubtaskContainer = styled.div`
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  border-left: 2.5px solid #ffaf74;

  & > div {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`

// Subtask title styling, including padding, alignment, and background color
const SubtaskTitle = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  padding: 0.5rem;
  padding-left: 1rem;
  background-color: #eee;
  border-radius: 8px;
  color: #666;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  *::selection {
    background-color: transparent;
  }
`

// Styling for the icon that toggles subtask expansion
const ToggleIcon = styled.span`
  display: inline-block;
  padding-right: 0.5rem;
  color: #ff9562;
  font-size: 0.9rem;
`

// Container for the right-side action icons (Edit, Delete, Add)
const RightIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

// Button styles for delete, edit, and add actions with hover effects
const DeleteButton = styled.button`
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #ff0000;
  }
`

const EditButton = styled.button`
  background: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #004691;
  }
`

const AddButton = styled.button`
  background: transparent;
  border: none;
  color: #28a745;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #21d24a;
  }
`

// Styled input field for editing task title
const InputField = styled.input`
  padding: 0.2rem;
  border: 1px solid red;
  flex: 1;
  background: white;
`

// Recursive component that displays a list of nested tasks
const NestedTaskList = ({ tasks }) => {
  return (
    <>
      {tasks.map((task) => (
        <NestedTask key={task.id} task={task} />
      ))}
    </>
  )
}

// Component for an individual task, with expand/collapse, edit, delete, and add subtask functionality
const NestedTask = ({ task }) => {
  const {
    onEditTask,
    createNewTask,
    onDeleteTask,
    setEditingTaskId,
    setdragSourceTask,
    dragSourceTask,
    editRef,
    moveBetweenTasks,
  } = useListContext()

  const [isExpanded, setIsExpanded] = useState(false) // Toggle state for subtasks display
  const [isEditing, setIsEditing] = useState(false) // Edit mode toggle
  const [newTitle, setNewTitle] = useState(task.title) // State for editable title

  // Handler to toggle expanded/collapsed state
  const handleToggle = () => setIsExpanded(!isExpanded)

  // Save edited title and exit edit mode
  const handleSaveEdit = () => {
    onEditTask(task.id, newTitle)
    setIsEditing(false)
    setEditingTaskId(null)
  }

  // Add a new subtask and set it to editing mode
  const handleAddSubtask = async () => {
    const new_task_id = await createNewTask('', task)
    setIsExpanded(true)
    setEditingTaskId(new_task_id)
  }

  // Move a dragged task into this task's subtask list
  const handleDrop = () => {
    moveBetweenTasks(dragSourceTask.current, task.id)
  }

  return (
    <>
      <SubtaskTitle
        onClick={handleToggle}
        draggable
        onDragStart={() => setdragSourceTask(task.id)}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div style={{ flex: 1 }}>
          {task.sub_items && task.sub_items.length > 0 && (
            <ToggleIcon>
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </ToggleIcon>
          )}
          {isEditing || editRef.current === task.id ? (
            <InputField
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              autoFocus
            />
          ) : (
            task.title
          )}
        </div>
        <RightIcons>
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation()
              onDeleteTask(task.id)
            }}
          >
            <MdDeleteOutline />
          </DeleteButton>
          <EditButton
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(!isEditing)
              setEditingTaskId(null)
            }}
          >
            <TbEdit />
          </EditButton>
          <AddButton
            onClick={(e) => {
              e.stopPropagation()
              handleAddSubtask()
            }}
          >
            <IoAddCircleSharp />
          </AddButton>
        </RightIcons>
      </SubtaskTitle>
      {isExpanded && task.sub_items && task.sub_items.length > 0 && (
        <SubtaskContainer>
          <NestedTaskList
            tasks={task.sub_items}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onAddSubtask={createNewTask}
          />
        </SubtaskContainer>
      )}
    </>
  )
}

export default NestedTaskList
