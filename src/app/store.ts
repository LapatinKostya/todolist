import {combineReducers} from 'redux';
import thunkMiddleware from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "../features/Auth"
import {tasksReducer, todolistsReducer} from "../features/TodolistsList"
import {appReducer} from "../features/Application";

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})


// @ts-ignore
window.store = store;
