import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers} from 'redux'
import {v1} from 'uuid'
import {configureStore} from "@reduxjs/toolkit"
import thunkMiddleware from "redux-thunk"
import {tasksReducer, todolistsReducer} from "../../features/TodolistsList";
import {appReducer} from "../../features/Application";
import {authReducer} from "../../features/Auth";
import {RootReducer, RootState} from "../../utils/types";
import {TaskPriorities, TaskStatuses} from "../../api/types";

const rootReducer: RootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer
})

const initialGlobalState: RootState = {
  todolists: [
    {id: "todolistId1", title: "What to learn", filter: "all", entityStatus: 'idle', addedDate: '', order: 0},
    {id: "todolistId2", title: "What to buy", filter: "all", entityStatus: 'loading', addedDate: '', order: 0}
  ],
  tasks: {
    "todolistId1": [
      {
        id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      },
      {
        id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      }
    ],
    "todolistId2": [
      {
        id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      },
      {
        id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
        startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, entityTaskStatus: 'idle'
      }
    ]
  },
  app: {
    error: null,
    status: 'idle',
    isInitialized: true
  },
  auth: {
    isLoggedIn: true
  }
}

export const storyBookStore = configureStore({
  reducer: rootReducer,
  preloadedState: initialGlobalState,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)
