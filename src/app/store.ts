import {combineReducers} from 'redux';
import thunkMiddleware from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import {FieldErrorType} from "../api/todolists-api";
import {appReducer} from "./"
import {authReducer} from "../features/Auth"
import {tasksReducer, todolistsReducer} from "../features/TodolistsList"

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer
})
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type TRootReducer = typeof rootReducer

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type ThunkError = { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }

// @ts-ignore
window.store = store;
