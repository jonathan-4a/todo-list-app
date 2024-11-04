import styled from 'styled-components'
import TaskItem from './TaskItem'

// Sidebar container styling
const StyledSideBar = styled.div`
  padding: 10px;
  width: 250px;
  background: white;
`

// Sidebar title styling
const Title = styled.div`
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
`

const Sidebar = ({ lists, setCurrentTask, currentTask }) => {
  return (
    <StyledSideBar>
      <Title>Categories</Title>
      {/* Render each list as a TaskItem, marking the current task as active */}
      {lists.map((list) => (
        <TaskItem
          task={list}
          key={list.id}
          setCurrentTask={setCurrentTask}
          activeTask={list === currentTask} // Set active styling based on current task
        />
      ))}
    </StyledSideBar>
  )
}

export default Sidebar
