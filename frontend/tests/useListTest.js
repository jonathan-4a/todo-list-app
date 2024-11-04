import { renderHook, act } from '@testing-library/react-hooks'
import useList from './src/hooks/useList'
import axios from 'axios'

jest.mock('axios') // Mock axios

describe('useList', () => {
  const mockToken = 'mockToken123'

  beforeEach(() => {
    // Set up local storage before each test
    localStorage.setItem('token', mockToken)
  })

  afterEach(() => {
    // Clean up after each test
    localStorage.removeItem('token')
    jest.clearAllMocks()
  })

  test('fetches tasks and lists on mount', async () => {
    const mockTasks = [{ id: 1, title: 'Task 1' }]
    const mockLists = [{ id: 1, name: 'List 1' }]

    axios.get
      .mockImplementationOnce(() => Promise.resolve({ data: mockLists }))
      .mockImplementationOnce(() => Promise.resolve({ data: mockTasks }))

    const { result, waitForNextUpdate } = renderHook(() => useList())

    await waitForNextUpdate() // Wait for the hook to update after fetching data

    expect(result.current.lists).toEqual(mockLists)
    expect(result.current.tasks).toEqual(mockTasks)
  })

  test('redirects to login if no token is available', async () => {
    localStorage.removeItem('token') // Remove token to simulate not logged in

    const { result } = renderHook(() => useList())

    expect(window.location.href).toBe('/login') // Check if redirected to login
  })

  test('creates a new list', async () => {
    const newList = { id: 2, name: 'New List' }

    axios.post.mockResolvedValueOnce({ data: newList })

    const { result } = renderHook(() => useList())

    await act(async () => {
      await result.current.createNewList('New List')
    })

    expect(result.current.lists).toContain(newList)
  })

  test('creates a new task', async () => {
    const newTask = { id: 2, title: 'New Task' }
    const parentTask = { list_id: 1, id: 1 }

    axios.post.mockResolvedValueOnce({ data: newTask })
    axios.get.mockResolvedValueOnce({ data: [newTask] })

    const { result } = renderHook(() => useList())

    await act(async () => {
      await result.current.createNewTask('New Task', parentTask)
    })

    expect(result.current.tasks).toContain(newTask)
  })

  test('edits an existing task', async () => {
    const editedTask = { id: 1, title: 'Edited Task' }

    axios.put.mockResolvedValueOnce({})
    axios.get.mockResolvedValueOnce({ data: [editedTask] })

    const { result } = renderHook(() => useList())

    await act(async () => {
      await result.current.onEditTask(1, 'Edited Task')
    })

    expect(result.current.tasks).toContainEqual(editedTask)
  })

  test('deletes a task', async () => {
    const taskToDelete = { id: 1, title: 'Task to Delete' }

    axios.delete.mockResolvedValueOnce({})
    axios.get.mockResolvedValueOnce({ data: [] }) // Return empty array after deletion

    const { result } = renderHook(() => useList())

    await act(async () => {
      await result.current.onDeleteTask(taskToDelete.id)
    })

    expect(result.current.tasks).not.toContainEqual(taskToDelete)
  })

  test('deletes a list', async () => {
    const listToDelete = { id: 1, name: 'List to Delete' }

    axios.delete.mockResolvedValueOnce({})
    axios.get.mockResolvedValueOnce({ data: [] }) // Return empty array after deletion

    const { result } = renderHook(() => useList())

    await act(async () => {
      await result.current.onDeleteList(listToDelete.id)
    })

    expect(result.current.lists).not.toContainEqual(listToDelete)
  })

  test('handles fetch errors gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'))

    const { result } = renderHook(() => useList())

    await act(async () => {
      await result.current.onEditTask(1, 'Some Task')
    })

    // Check that the tasks haven't changed due to the error
    expect(result.current.tasks).toEqual([])
  })
})
