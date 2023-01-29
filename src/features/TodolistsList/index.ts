import {asyncActions as taskAsyncActions, slice as taskSlice} from './tasks-reducer'
import {asyncActions as todolistAsyncActions, slice as todolistSlice} from './todolists-reducer'
import {TodolistsList} from './TodolistsList'

const todolistActions = {
  ...todolistAsyncActions,
  ...todolistSlice.actions
}
const taskActions = {
  ...taskAsyncActions,
  ...taskSlice.actions
}

const todolistsReducer = todolistSlice.reducer
const tasksReducer = taskSlice.reducer

export {
  taskActions,
  todolistActions,
  todolistsReducer,
  tasksReducer,
  TodolistsList
}