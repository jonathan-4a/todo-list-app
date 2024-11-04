import { Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import DashBoard from './pages/DashBoard'
import NavBar from './components/NavBar'
import Signup from './pages/SignUp'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import AddList from './pages/AddList'
import { useAuthContext } from './contexts/AuthContext'
import { ListProvider } from './contexts/ListContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; // Ensures the container takes at least the full viewport height
`

const App = () => {
  const { login, signup, error, isLoggedIn, setError } = useAuthContext()

  return (
    <Container>
      <NavBar />
      <Routes>
        <Route
          path='/'
          exact
          element={
            <ProtectedRoute
              element={<ConditionalListProvider component={DashBoard} />}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path='/new-list'
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              element={<ConditionalListProvider component={AddList} />}
            />
          }
        />
        <Route
          path='/signup'
          element={
            <ProtectedRoute
              isLoggedIn={!isLoggedIn} // Prevent logged-in users from accessing signup
              path='/'
              element={
                <Signup signup={signup} error={error} setError={setError} />
              }
            />
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute
              element={
                <Login error={error} login={login} setError={setError} />
              }
              isLoggedIn={!isLoggedIn} // Prevent logged-in users from accessing login
              path='/'
            />
          }
        />
      </Routes>
    </Container>
  )
}

// Conditionally provide the list context based on login status
const ConditionalListProvider = ({ component: Component }) => {
  const { isLoggedIn } = useAuthContext()
  return isLoggedIn ? (
    <ListProvider>
      <Component />
    </ListProvider>
  ) : (
    <Component />
  )
}

export default App
