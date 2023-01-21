import {TaskPriorities, TaskStatuses, TaskType} from "../../api/todolists-api"
import {RequestStatusType} from "../../app/app-reducer"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTask, fetchTasks, removeTask, updateTask} from "./tasks-actions";
import {addTodolist, fetchTodolists, removeTodolist} from "./todolists-actions";

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
            .addCase(fetchTodolists.fulfilled, (state, action) => {
              action.payload.todolists.forEach(t => {
                state[t.id] = []
              })
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
              state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
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



