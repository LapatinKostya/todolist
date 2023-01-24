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
import {useActions} from "../../../utils/hooks/useActions";

type PropsType = {
  id: string
  title: string
  tasks: TaskDomainType[]
  filter: FilterValuesType
  entityStatus: RequestStatusType
  demo?: boolean
}

export const Todolist = memo(function ({demo = false, ...props}: PropsType) {

      const {removeTodolist, changeTodolistFilter, changeTodolistTitle, addTask, fetchTasks} = useActions()

      useEffect(() => {
        if (demo) {
          return
        }
        fetchTasks(props.id)
      }, [])

      const addTaskHandler = useCallback((params: { title: string }) => {
        addTask({todolistId: props.id, title: params.title})
      }, [])

      const removeTodolistHandler = () => {
        removeTodolist({todolistId: props.id})
      }
      const changeTodolistTitleHandler = (title: string) => {
        changeTodolistTitle({todolistId: props.id, title})
      }

      let tasksForTodolist = props.tasks

      if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
      }
      if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)

      }
      const isDisabled = props.entityStatus === 'loading'

      const renderFilterButton = (
          color: "inherit" | "primary" | "secondary",
          buttonValue: FilterValuesType,
          text: string) => {
        return (
            <Button variant={props.filter === buttonValue ? 'outlined' : 'text'}
                    onClick={() => changeTodolistFilter({id: props.id, filter: buttonValue})}
                    color={color}
                    disabled={isDisabled}
            >
              {text}
            </Button>
        )
      }

      return (
          <div>
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
                    isDisabled={isDisabled}
                    todolistId={props.id}
                />)
              }
            </div>
            <div style={{paddingTop: '10px'}}>
              {renderFilterButton('inherit', "all", 'All')}
              {renderFilterButton('primary', "active", 'Active')}
              {renderFilterButton('secondary', "completed", 'Completed')}
            </div>
          </div>
      )
    }
)

