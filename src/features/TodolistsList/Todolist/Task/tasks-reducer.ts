import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../../../api/todolists-api"
import {AppThunk, RootState} from "../../../../app/store"
import {RequestStatusType, setAppStatusAC} from "../../../../app/app-reducer"
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "../todolists-reducer";

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      const res = await todolistsAPI.getTasks(todolistId)
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolistId, tasks: res.data.items}
    })
export const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      thunkAPI.dispatch(changeTaskEntityStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: 'loading'
      }))
      return todolistsAPI.deleteTask(param.todolistId, param.taskId)
          .then(() => {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            thunkAPI.dispatch(changeTaskEntityStatusAC({
              todolistId: param.todolistId,
              taskId: param.taskId,
              entityStatus: 'succeeded'
            }))
            return {taskId: param.taskId, todolistId: param.todolistId}
          })
      // .catch((error) => {
      //   handleServerNetworkError(error, thunkAPI.dispatch)
      //   thunkAPI.dispatch(changeTaskEntityStatusAC({
      //     todolistId: param.todolistId,
      //     taskId: param.taskId,
      //     entityStatus: 'failed'
      //   }))
      // })
    }
)

const slice = createSlice({
      name: 'tasks',
      initialState,
      reducers: {
        addTaskAC(state, action: PayloadAction<TaskType>) {
          state[action.payload.todoListId].unshift({...action.payload, entityTaskStatus: 'idle'})
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
            .addCase(fetchTasks.fulfilled, (state, action) => {
              state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityTaskStatus: 'idle'}))
            })
            .addCase(removeTask.fulfilled, (state, action) => {
              const tasks = state[action.payload.todolistId]
              const index = tasks.findIndex(t => t.id === action.payload.taskId)
              if (index > -1) {
                tasks.splice(index, 1)
              }
            })
      }
    }
)

export const tasksReducer = slice.reducer

export const {addTaskAC, updateTaskAC, changeTaskEntityStatusAC} = slice.actions

// thunks
export const createTasksTC = (todolistId: string, title: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC(res.data.data.item))
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



