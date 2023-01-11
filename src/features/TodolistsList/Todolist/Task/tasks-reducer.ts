import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../../../api/todolists-api"
import {AppRootStateType, AppThunk} from "../../../../app/store"
import {RequestStatusType, setAppStatusAC} from "../../../../app/app-reducer"
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
  name: 'task',
  initialState: initialState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
      }
    },
    addTaskAC(state, action: PayloadAction<{ todolistId: string, task: TaskType }>) {
      // return {...state, [action.payload.todolistId]: [action.payload.task, ...state[action.payload.todolistId]]}
      state[action.payload.todolistId]: state[action.payload.todolistId].unshift(action.payload.task)
    },
    updateTaskAC(state, action: PayloadAction<{todolistId: string, taskId: string, task: TaskType}>) {
      // return {
      //   ...state,
      //   [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? action.payload.task : t)
      // }
    },
    removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
      }
    }
  }
})

export const tasksReducer = slice.reducer
//     (state: TasksStateType = initialState, action: TasksActionTypes): TasksStateType => {
//     switch (action.type) {
//         case 'REMOVE-TASK':
//             return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
//         case 'ADD-TASK':
//             return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}
//         case "UPDATE-TASK":
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? action.task : t)
//             }
//         // case 'SET-TODOLISTS':
//         //     const stateCopy = {...state}
//         //     action.todolists.forEach(t => {
//         //         stateCopy[t.id] = []
//         //     })
//         //     return stateCopy
//         // case 'ADD-TODOLIST':
//         //     return {...state, [action.todolist.id]: []}
//         // case 'REMOVE-TODOLIST':
//         //     const copyState = {...state};
//         //     delete copyState[action.id];
//         //     return copyState;
//         case 'SET-TASKS':
//             return {...state, [action.todolistId]: action.tasks.map(t => ({...t, entityTaskStatus: 'idle'}))}
//         case "CHANGE-TASK-ENTITY-STATUS":
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
//                     ...t,
//                     entityTaskStatus: action.entityStatus
//                 } : t)
//             }
//         default:
//             return state;
//     }
// }

// actions
// export const removeTaskAC = (taskId: string, todolistId: string) =>
//     ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)
// export const addTaskAC = (todolistId: string, task: TaskType) =>
//     ({type: 'ADD-TASK', todolistId, task: {...task, entityTaskStatus: 'idle'}} as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', todolistId, tasks} as const)
export const updateTaskAC = (todolistId: string, taskId: string, task: TaskType) =>
    ({type: 'UPDATE-TASK', todolistId, taskId, task: {...task, entityTaskStatus: 'idle'}} as const)
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TASK-ENTITY-STATUS', todolistId, taskId, entityStatus} as const)
// thunks
export const setTasksTC = (todolistId: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.getTasks(todolistId)
      .then((res) => {
        dispatch(setTasksAC(todolistId, res.data.items))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      }).catch((error) => {
    handleServerNetworkError(error, dispatch)
  })
}
export const removeTasksTC = (todolistId: string, taskId: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
  todolistsAPI.deleteTask(todolistId, taskId)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(removeTaskAC(taskId, todolistId))
          dispatch(setAppStatusAC({status: 'succeeded'}))
          dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'succeeded'))
        } else {
          handleServerAppError(res.data, dispatch)
          dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
      })

}
export const createTasksTC = (todolistId: string, title: string): AppThunk => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistsAPI.createTask(todolistId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC(todolistId, res.data.data.item))
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
    (dispatch, getState: () => AppRootStateType) => {
      dispatch(setAppStatusAC({status: 'loading'}))
      dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
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
              dispatch(updateTaskAC(todolistId, taskId, res.data.data.item))
              dispatch(setAppStatusAC({status: 'succeeded'}))
              dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'succeeded'))
            } else {
              handleServerAppError(res.data, dispatch)
              dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
            }
          })
          .catch((error) => {
            handleServerNetworkError(error, dispatch)
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
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
type SetTaskAT = ReturnType<typeof setTasksAC>
// type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type UpdateTaskAT = ReturnType<typeof updateTaskAC>
type ChangeTasksEntityStatusAT = ReturnType<typeof changeTaskEntityStatusAC>
export type TasksActionTypes =
    | ChangeTasksEntityStatusAT
    | SetTaskAT
    // | RemoveTaskAT
    | AddTaskAT
    | UpdateTaskAT



