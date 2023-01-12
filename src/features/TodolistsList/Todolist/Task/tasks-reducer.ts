import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../../../api/todolists-api"
import {RootState, AppThunk} from "../../../../app/store"
import {RequestStatusType, setAppStatusAC} from "../../../../app/app-reducer"
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "../todolists-reducer";

const initialState: TasksStateType = {}

const slice = createSlice({
      name: 'tasks',
      initialState,
      reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex(t => t.id === action.payload.taskId)
          if (index > -1) {
            tasks.splice(index, 1)
          }
        },
        addTaskAC(state, action: PayloadAction<{ todolistId: string, task: TaskType }>) {
          state[action.payload.todolistId].unshift({...action.payload.task, entityTaskStatus: 'idle'})
        },
        updateTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string, task: TaskType }>) {
          let tasks = state[action.payload.todolistId]
          const index = tasks.findIndex(t => t.id === action.payload.taskId)
          tasks[index] = {...action.payload.task, entityTaskStatus: 'idle'}
        },
        changeTaskEntityStatusAC(state, action: PayloadAction<{
          todolistId: string,
          taskId: string,
          entityStatus: RequestStatusType
        }>) {
          let task = state[action.payload.todolistId].find(t => t.id === action.payload.taskId)
          if (task) {
            task.entityTaskStatus = action.payload.entityStatus
          }
        },
        setTasksAC(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
          state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityTaskStatus: 'idle'}))
        },
      },
      extraReducers: (builder) => {
        builder
            .addCase(setTodolistsAC, (state, action) => {
              action.payload.todolists.forEach(t => {
                state[t.id] = []
              })
            })
            .addCase(addTodolistAC, (state, action) => {
              state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolistAC, (state, action) => {
              delete state[action.payload.id]
            })
      }
    }
)

export const tasksReducer = slice.reducer

export const {removeTaskAC, addTaskAC, updateTaskAC, changeTaskEntityStatusAC, setTasksAC} = slice.actions
// thunks
export const setTasksTC = (todolistId: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.getTasks(todolistId)
      .then((res) => {
        dispatch(setTasksAC({todolistId, tasks: res.data.items}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      }).catch((error) => {
    handleServerNetworkError(error, dispatch)
  })
}
export const removeTasksTC = (todolistId: string, taskId: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  dispatch(changeTaskEntityStatusAC({todolistId, taskId, entityStatus: 'loading'}))
  todolistsAPI.deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(removeTaskAC({taskId, todolistId}))
          dispatch(setAppStatusAC({status: 'succeeded'}))
          dispatch(changeTaskEntityStatusAC({todolistId, taskId, entityStatus: 'succeeded'}))
        } else {
          handleServerAppError(res.data, dispatch)
          dispatch(changeTaskEntityStatusAC({todolistId, taskId, entityStatus: 'failed'}))
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
        dispatch(changeTaskEntityStatusAC({todolistId, taskId, entityStatus: 'failed'}))
      })

}
export const createTasksTC = (todolistId: string, title: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC({todolistId, task: res.data.data.item}))
          dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
}
export const updateTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk =>
    (dispatch, getState: () => RootState) => {
      dispatch(setAppStatusAC({status: 'loading'}))
      dispatch(changeTaskEntityStatusAC({todolistId, taskId, entityStatus: 'loading'}))
      const state = getState()
      const task = state.tasks[todolistId].find(t => t.id === taskId)
      if (!task) {
        console.warn('Task not found in state')
        return
      }
      const model: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel
      }
      todolistsAPI.updateTask(todolistId, taskId, model)
          .then((res) => {
            if (res.data.resultCode === 0) {
              console.log(res.data.data.item)
              dispatch(updateTaskAC({todolistId, taskId, task: res.data.data.item}))
              dispatch(setAppStatusAC({status: 'succeeded'}))
              dispatch(changeTaskEntityStatusAC({todolistId, taskId, entityStatus: 'succeeded'}))
            } else {
              handleServerAppError(res.data, dispatch)
              dispatch(changeTaskEntityStatusAC({todolistId, taskId, entityStatus: 'failed'}))
            }
          })
          .catch((error) => {
            handleServerNetworkError(error, dispatch)
            dispatch(changeTaskEntityStatusAC({todolistId, taskId, entityStatus: 'failed'}))
          })
    }

// types
type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TaskDomainType = TaskType & {
  entityTaskStatus: RequestStatusType
}
export type TasksStateType = {
  [key: string]: TaskDomainType[]
}



