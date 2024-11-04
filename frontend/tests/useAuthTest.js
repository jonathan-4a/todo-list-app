import { renderHook, act } from '@testing-library/react-hooks'
import useAuth from './src/hooks/useAuth'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

jest.mock('axios')
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

describe('useAuth', () => {
  const navigate = jest.fn()

  beforeEach(() => {
    localStorage.clear()
    useNavigate.mockReturnValue(navigate)
  })

  it('should initialize with isLoggedIn as false', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should set isLoggedIn to true if token exists in local storage', () => {
    localStorage.setItem('token', 'dummyToken')
    const { result } = renderHook(() => useAuth())
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('should login and set token in local storage', async () => {
    const mockResponse = { data: { access_token: 'dummyToken' } }
    axios.post.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('username', 'password')
    })

    expect(localStorage.getItem('token')).toBe('dummyToken')
    expect(result.current.isLoggedIn).toBe(true)
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials'
    axios.post.mockRejectedValue({
      response: { data: { message: errorMessage } },
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('username', 'wrongPassword')
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.isLoggedIn).toBe(false)
  })

  it('should signup and navigate to login page', async () => {
    axios.post.mockResolvedValue({})

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signup('username', 'password')
    })

    expect(navigate).toHaveBeenCalledWith('/login')
  })

  it('should handle signup error', async () => {
    const errorMessage = 'Signup failed'
    axios.post.mockRejectedValue({
      response: { data: { message: errorMessage } },
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signup('username', 'password')
    })

    expect(result.current.error).toBe(errorMessage)
  })

  it('should logout and clear token', () => {
    localStorage.setItem('token', 'dummyToken')
    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('token')).toBe(null)
    expect(result.current.isLoggedIn).toBe(false)
    expect(navigate).toHaveBeenCalledWith('/login')
  })
})
