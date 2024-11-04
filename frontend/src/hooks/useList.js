import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

// Define base API URL for task and list operations
const REMOTE_URL = 'http://127.0.0.1:5000'

const useList = () => {
  // State to hold tasks and lists data
  const [tasks, setTasks] = useState([])
  const [lists, setLists] = useState([])
  const token = localStorage.getItem('token') // Fetch token for authorization
  const editRef = useRef(null) // Ref for currently edited task
  const dragSourceTask = useRef(null) // Ref for the dragged task during DnD operations

  useEffect(() => {
    // Fetch tasks and lists on component mount if token is valid
    const fetchTasksAndLists = async () => {
      if (!token) {
        // Redirect to login if no token is found
        localStorage.removeItem('token')
        window.location.href = '/login'
        return
      }

      try {
        // Fetch tasks data
        const { data: taskData } = await axios.get(`${REMOTE_URL}/lists`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTasks(taskData)

        // Fetch lists data
        const { data: listData } = await axios.get(`${REMOTE_URL}/get-lists`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setLists(listData)
      } catch (error) {
        // Handle errors and redirect to login if unauthorized
        console.error('Error fetching tasks or lists:', error)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
      }
    }

    fetchTasksAndLists()
  }, [token])

  // Set the ID of the task being edited
  const setEditingTaskId = (task_id) => {
    editRef.current = task_id
  }

  // Set the source task ID for drag and drop
  const setdragSourceTask = (source_id) => {
    dragSourceTask.current = source_id
  }

  // Create a new list and add it to the current state
  const createNewList = async (name) => {
    try {
      const { data } = await axios.post(
        `${REMOTE_URL}/create-list`,
        { name },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setLists((lists) => [...lists, data]) // Add new list to the state
    } catch (error) {
      console.error('Error creating new list:', error)
      throw error
    }
  }

  // Create a new task under a specified parent task
  const createNewTask = async (title, parent_task) => {
    try {
      const new_task = {
        title: title,
        list_id: parent_task.list_id,
        parent_id: parent_task.id,
      }
      const { data: new_task_id } = await axios.post(
        `${REMOTE_URL}/new-task`,
        new_task,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Fetch updated tasks after creation
      const { data: taskData } = await axios.get(`${REMOTE_URL}/lists`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(taskData)

      return new_task_id
    } catch (error) {
      console.error('Error creating new task:', error)
      throw error
    }
  }

  // Edit an existing task's title
  const onEditTask = async (id, title) => {
    try {
      await axios.put(
        `${REMOTE_URL}/edit-task`,
        { id, title },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // Fetch updated tasks after edit
      const { data: taskData } = await axios.get(`${REMOTE_URL}/lists`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(taskData)
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  // Delete a task by ID
  const onDeleteTask = async (id) => {
    try {
      await axios.delete(`${REMOTE_URL}/delete-task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch updated tasks after deletion
      const { data: taskData } = await axios.get(`${REMOTE_URL}/lists`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(taskData)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // Move a task to a new parent task (drag-and-drop)
  const moveBetweenTasks = async (src_task_id, parent_id) => {
    try {
      if (src_task_id === parent_id) {
        return
      }

      await axios.put(
        `${REMOTE_URL}/move-between-tasks`,
        { src_task_id, parent_id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // Fetch updated tasks after move
      const { data: taskData } = await axios.get(`${REMOTE_URL}/lists`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(taskData)
    } catch (error) {
      console.error('Error moving task between tasks:', error)
    }
  }

  // Delete a list by ID
  const onDeleteList = async (listId) => {
    try {
      await axios.delete(`${REMOTE_URL}/delete-list/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Remove the list from the local state
      setLists(lists.filter((list) => list.id !== listId))
    } catch (error) {
      console.error('Error deleting list:', error)
    }
  }

  // Move a task to a different list
  const onMoveTask = async (taskId, newListId) => {
    try {
      await axios.put(
        `${REMOTE_URL}/move-task/${taskId}/${newListId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // Fetch updated tasks after moving
      const { data: taskData } = await axios.get(`${REMOTE_URL}/lists`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(taskData)
    } catch (error) {
      console.error('Error moving task to new list:', error)
    }
  }

  // Return all functions and state variables to use in components
  return {
    tasks,
    lists,
    createNewList,
    createNewTask,
    onEditTask,
    onDeleteTask,
    onDeleteList,
    onMoveTask,
    setEditingTaskId,
    editRef,
    dragSourceTask,
    setdragSourceTask,
    moveBetweenTasks,
  }
}

export default useList
