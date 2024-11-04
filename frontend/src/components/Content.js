import styled from 'styled-components'
import NestedTaskList from './NestedTaskList'
import { RiCloseCircleFill } from 'react-icons/ri'
import { MdAddCircleOutline } from 'react-icons/md'
import { useListContext } from '../contexts/ListContext'

// Styled components for layout and design
const StyledContent = styled.div`
  padding: 3rem;
  width: 100%;
  max-height: calc(100vh - 4rem);
  overflow: auto;
  border-radius: 8px;
`

const TaskTitle = styled.div`
  width: 100%;
  padding: 0 0 1rem 0;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`

const DefaultText = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  font-weight: 400;
  font-size: 1.1rem;
  color: #555;
`

const Card = styled.div`
  background: #fffffff0;
  padding: 3rem;
  border-radius: 0.5rem;
  width: 100%;
  box-shadow: 0 0.5px 4px rgba(0, 0, 0, 0.1);
`

const Action = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center; // Corrected typo from 'align-itmes'
`

const Title = styled.div`
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
`

const AddTask = styled.div`
  margin-top: 2rem;
  padding: 0.7rem;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.3rem;
  color: #97979699;
  box-shadow: inset 0 0 0 2px #f0f0f0;
  border-radius: 5px;
  transition: all 0.2s ease;
  cursor: pointer;

  // Hover effects for AddTask button
  &:hover {
    box-shadow: inset 0 0 0 4px #f3f3f3;
    color: #979796ce;

    & > svg {
      color: #979796aa;
    }
  }

  & > svg {
    color: #ccc;
    transition: all 0.2s ease;
  }

  // Active state for AddTask button
  &:active {
    background: #f4f4f4;
    box-shadow: inset 0 0 0 1px #eee;
  }
`

function Content({ currentTasks, selectedTask, setSelectedTask }) {
  const { onDeleteList, onDeleteTask, setEditingTaskId, createNewTask } =
    useListContext()

  return (
    <StyledContent>
      {selectedTask && (
        <Card>
          <TaskTitle>
            <Title>{selectedTask?.name}</Title>
            <Action>
              {/* Delete task icon with click handler */}
              <RiCloseCircleFill
                name='Delete Task'
                size={24}
                color='#DC1B1B'
                cursor={'pointer'}
                onClick={() => {
                  onDeleteList(selectedTask.id) // Delete the selected task
                  setSelectedTask(null) // Clear selection after deletion
                }}
              />
            </Action>
          </TaskTitle>
          {currentTasks.length !== 0 ? (
            <>
              {currentTasks.map((task) => (
                // Render nested task list for each task
                <NestedTaskList
                  key={task.id}
                  tasks={[task]}
                  onDeleteTask={onDeleteTask}
                />
              ))}
            </>
          ) : (
            <DefaultText>No Tasks To Show</DefaultText>
          )}
          <AddTask
            onClick={async () => {
              const new_task_id = await createNewTask('', {
                list_id: selectedTask.id,
              }) // Create a new task
              setEditingTaskId(new_task_id) // Set the new task as being edited
            }}
          >
            <MdAddCircleOutline size={27} />
            <span>Click Here To Add Task...</span>
          </AddTask>
        </Card>
      )}
    </StyledContent>
  )
}

export default Content
