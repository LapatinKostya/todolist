import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api"
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer"
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {RootState} from "../../app/store";
import {todolistActions} from "./";

const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      const res = await todolistsAPI.getTasks(todolistId)
      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolistId, tasks: res.data.items}
    })
const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      thunkAPI.dispatch(changeTaskEntityStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: 'loading'
      }))
      const res = todolistsAPI.deleteTask(param.todolistId, param.taskId)

      thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
      thunkAPI.dispatch(changeTaskEntityStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: 'succeeded'
      }))
      return {taskId: param.taskId, todolistId: param.todolistId}
    })
const addTask = createAsyncThunk(
    'tasks/addTask',
    async (param: { todolistId: string, title: string }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      try {
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          return res.data.data.item
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
          return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined})
      }
    }
)
const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (param: { todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType }, thunkAPI) => {
      thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
      thunkAPI.dispatch(changeTaskEntityStatusAC({
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
          thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
          thunkAPI.dispatch(changeTaskEntityStatusAC({
            todolistId: param.todolistId,
            taskId: param.taskId,
            entityStatus: 'succeeded'
          }))
          return res.data.data.item
        } else {
          handleServerAppError(res.data, thunkAPI.dispatch)
          return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
      } catch (e) {
        const err = e as Error | AxiosError<{ error: string }>
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
      }
    }
)
export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask
}

const slice = createSlice({
      name: 'tasks',
      initialState: {} as TasksStateType,
      reducers: {
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

export const tasksReducer = slice.reducer

export const {changeTaskEntityStatusAC} = slice.actions

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


