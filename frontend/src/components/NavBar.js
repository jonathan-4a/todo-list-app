import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

// Styled navigation bar
const Nav = styled.nav`
  background: #fffffffa;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: sticky; // Keeps navbar fixed at the top
  top: 0;
`

// Logo styling
const Logo = styled.img`
  width: 9rem;
`

const NavLinkContainer = styled.div`
  display: flex;
`

const NavLink = styled(Link)`
  text-decoration: none;
  margin-left: 10px;
  color: black;
  font-size: 0.88rem;
  padding: 5px 12px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    color: #f5771d; // Hover color
  }

  &:active {
    color: #eb3902; // Active state color
  }
`

export default function NavBar() {
  const location = useLocation() // Tracks current route
  const { isLoggedIn, logout } = useAuthContext()

  return (
    <Nav>
      <NavLink to='/'>
        <Logo src='logo.png' alt='Logo' />
      </NavLink>
      {isLoggedIn && ( // Show links only if user is logged in
        <NavLinkContainer>
          {location.pathname !== '/' && <NavLink to='/'>Home</NavLink>}
          {location.pathname !== '/new-list' && (
            <NavLink to='/new-list'>Add Group</NavLink> // Conditional navigation link
          )}
          <NavLink onClick={logout}>Sign out</NavLink>
        </NavLinkContainer>
      )}
    </Nav>
  )
}
