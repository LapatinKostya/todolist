import {TodolistType} from "../../api/todolists-api";
import {RequestStatusType} from "../../app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolist, fetchTodolists, removeTodolist, updateTodolistTitle} from "./todolists-actions";

const initialState: TodolistDomainType[] = []

export const slice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.entityStatus
    },
  },
  extraReducers: builder => {
    builder
        .addCase(fetchTodolists.fulfilled, (state, action) => {
          return action.payload.todolists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        })
        .addCase(removeTodolist.fulfilled, (state, action) => {
          const index = state.findIndex(tl => tl.id === action.payload.todolistId)
          state.splice(index, 1)
        })
        .addCase(addTodolist.fulfilled, (state, action) => {
          state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
        })
        .addCase(updateTodolistTitle.fulfilled, (state, action) => {
          const index = state.findIndex(tl => tl.id === action.payload.todolistId)
          state[index].title = action.payload.title
        })
  },
})

export const todolistsReducer = slice.reducer

// for tests
export const {
  changeTodolistFilter,
  changeTodolistEntityStatus
} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType

}
