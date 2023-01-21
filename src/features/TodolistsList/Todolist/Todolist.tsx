import React, {memo, useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import {Delete} from '@mui/icons-material'
import {Task} from './Task/Task'
import {FilterValuesType} from "../todolists-reducer";
import {TaskStatuses} from "../../../api/todolists-api";
import {TaskDomainType} from "../tasks-reducer";
import {RequestStatusType} from "../../../app/app-reducer";
import {useAppDispatch} from "../../../utils/hooks/useAppDispatch";
import {fetchTasks} from "../tasks-actions";
import {useActions} from "../../../utils/hooks/useActions";

type PropsType = {
  id: string
  title: string
  tasks: TaskDomainType[]
  changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
  changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
  filter: FilterValuesType
  entityStatus: RequestStatusType
  demo?: boolean
}

export const Todolist = memo(function ({demo = false, ...props}: PropsType) {

  const dispatch = useAppDispatch();
  const {removeTodolist, changeTodolistFilter, changeTodolistTitle, addTask} = useActions()

  useEffect(() => {
    if (demo) {
      return
    }
    dispatch(fetchTasks(props.id))
  }, [])

  const addTaskHandler = useCallback((params: { title: string }) => {
    addTask({todolistId: props.id, title: params.title})
  }, [])

  const removeTodolistHandler = () => {
    removeTodolist({todolistId: props.id})
  }
  const changeTodolistTitleHandler = useCallback((title: string) => {
    changeTodolistTitle({todolistId: props.id, title})
  }, [])

  const onAllClickHandler = () => {
    changeTodolistFilter({id: props.id, filter: 'all'})
  }
  const onActiveClickHandler = () => {
    changeTodolistFilter({id: props.id, filter: 'active'})
  }
  const onCompletedClickHandler = () => {
    changeTodolistFilter({id: props.id, filter: 'completed'})
  }

  let tasksForTodolist = props.tasks

  if (props.filter === 'active') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
  }
  if (props.filter === 'completed') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
  }
  const isDisabled = props.entityStatus === 'loading'

  return <div>
    <h3>
      <EditableSpan
          value={props.title}
          onChange={changeTodolistTitleHandler}
          isDisabled={isDisabled}
      />
      <IconButton onClick={removeTodolistHandler} disabled={isDisabled}>
        <Delete/>
      </IconButton>
    </h3>
    <AddItemForm addItem={addTaskHandler} disabled={isDisabled}/>
    <div>
      {
        tasksForTodolist.map(t => <Task
            key={t.id}
            task={t}
            entityTaskStatus={t.entityTaskStatus}
            todolistId={props.id}
            changeTaskTitle={props.changeTaskTitle}
            changeTaskStatus={props.changeTaskStatus}
        />)
      }
    </div>
    <div style={{paddingTop: '10px'}}>
      <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
              onClick={onAllClickHandler}
              color={'inherit'}
              disabled={props.entityStatus === 'loading'}
      >
        All
      </Button>
      <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
              onClick={onActiveClickHandler}
              color={'primary'}
              disabled={props.entityStatus === 'loading'}
      >
        Active
      </Button>
      <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
              onClick={onCompletedClickHandler}
              color={'secondary'}
              disabled={props.entityStatus === 'loading'}
      >
        Completed
      </Button>
    </div>
  </div>
})


