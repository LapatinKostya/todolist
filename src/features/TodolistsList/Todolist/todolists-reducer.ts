import {todolistsAPI, TodolistType} from "../../../api/todolists-api";
import {AppThunk} from "../../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      return  action.payload.todolists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
    },
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state.splice(index, 1)
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
    },
    updateTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].title = action.payload.title
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.entityStatus
    },
  }
})

export const todolistsReducer = slice.reducer

export const {
  setTodolistsAC,
  removeTodolistAC,
  addTodolistAC,
  updateTodolistTitleAC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC
} = slice.actions
// thunks
export const setTodolistsTC = (): AppThunk => async dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  try {
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistsAC({todolists: res.data}))
    dispatch(setAppStatusAC({status: "succeeded"}))
  } catch (e) {
    dispatch(setAppStatusAC({status: "failed"}))
  }
}
export const removeTodolistTC = (todolistId: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
  todolistsAPI.deleteTodolist(todolistId)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "succeeded"}))
          dispatch(setAppStatusAC({status: 'succeeded'}))
          dispatch(removeTodolistAC({id: todolistId}))
        } else {
          handleServerAppError(res.data, dispatch)
          dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "failed"}))
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
        dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "failed"}))
      })
}
export const addTodolistTC = (title: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.createTodolist(title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTodolistAC({todolist: res.data.data.item}))
          dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })

}
export const updateTodolistTitleTC = (todolistId: string, title: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.updateTodolistTitle(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(updateTodolistTitleAC({id: todolistId, title: title}))
          dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType

}
