import {todolistsAPI} from "../../api/todolists-api"
import {RequestStatusType} from "../Application/application-reducer"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {AxiosError} from "axios"
import {todolistActions} from "./"
import {RootState, ThunkError} from "../../utils/types"
import {TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType} from "../../api/types"
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../utils/error-utils"
import {appActions} from "../CommonActions/App"

const {setAppStatus} = appActions

const fetchTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string, ThunkError>(
    'tasks/fetchTasks',
    async (todolistId, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      try {
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {tasks, todolistId}
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    })

const removeTask = createAsyncThunk<{ taskId: string, todolistId: string }, { todolistId: string, taskId: string }, ThunkError>(
    'tasks/removeTask',
    async (param, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      thunkAPI.dispatch(changeTaskEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: 'loading'
      }))
      try {
        const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return {taskId: param.taskId, todolistId: param.todolistId}
        } else {
          return handleAsyncServerAppError(res.data, thunkAPI)
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    })


const addTask = createAsyncThunk(
    'tasks/addTask',
    async (param: { todolistId: string, title: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      try {
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          return res.data.data.item
        } else {
          return handleAsyncServerAppError(res.data, thunkAPI)
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    })

const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (param: { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatus({status: 'loading'}))
      thunkAPI.dispatch(changeTaskEntityStatus({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: 'loading'
      }))
      const state = thunkAPI.getState() as RootState
      const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
      if (!task) {
        return thunkAPI.rejectWithValue('Task not found in state')
      }
      const model: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...param.domainModel
      }
      try {
        const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, model)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
          thunkAPI.dispatch(changeTaskEntityStatus({
            todolistId: param.todolistId,
            taskId: param.taskId,
            entityStatus: 'succeeded'
          }))
          return res.data.data.item
        } else {
          return handleAsyncServerAppError(res.data, thunkAPI)
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        return handleAsyncServerNetworkError(err, thunkAPI)
      }
    }
)
export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask
}

export const slice = createSlice({
      name: 'tasks',
      initialState: {} as TasksStateType,
      reducers: {
        changeTaskEntityStatus(state, action: PayloadAction<{
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
            .addCase(todolistActions.fetchTodolists.fulfilled, (state, action) => {
              action.payload.todolists.forEach(t => {
                state[t.id] = []
              })
            })
            .addCase(todolistActions.addTodolist.fulfilled, (state, action) => {
              state[action.payload.todolist.id] = []
            })
            .addCase(todolistActions.removeTodolist.fulfilled, (state, action) => {
              delete state[action.payload.todolistId]
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
            .addCase(addTask.fulfilled, (state, action) => {
              state[action.payload.todoListId].unshift({...action.payload, entityTaskStatus: 'idle'})
            })
            .addCase(updateTask.fulfilled, (state, action) => {
              const tasks = state[action.payload.todoListId]
              const index = tasks.findIndex(t => t.id === action.payload.id)
              tasks[index] = {...action.payload, entityTaskStatus: 'idle'}
            })
      }
    }
)

export const {changeTaskEntityStatus} = slice.actions

// types
export type UpdateDomainTaskModelType = {
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



