import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPrioritiesType, TaskStatusesType, TaskType, todolistsApi, UpdateTaskType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatusesType
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}
export type SetTasksAT = ReturnType<typeof setTasksAC>
export type UpdateTaskAT = ReturnType<typeof updateTaskAC>


type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksAT
    | UpdateTaskAT


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)
            }
        }
        case 'ADD-TASK': {
            const task = action.task
            return {
                ...state,
                [task.todoListId]: [action.task, ...state[task.todoListId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    status: action.status
                } : t)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    title: action.title
                } : t)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS': {
            const copy = {...state}
            action.todolists.forEach(tl => {
                copy[tl.id] = []
            })
            return copy

        }
        case 'SET-TASKS': {
            return {
                ...state, [action.todolistId]: action.tasks
            }
        }
        case 'UPDATE-TASK': {
            debugger
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {
                        ...t,
                        status: action.newTask.status,
                        title: action.newTask.title
                    } : t)
            }
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => {
    return {type: 'SET-TASKS', todolistId, tasks} as const
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatusesType, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const updateTaskAC = (todolistId: string, taskId: string, newTask: TaskType) => {
    return {type: 'UPDATE-TASK', newTask, todolistId, taskId} as const
}

export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsApi.getTasks(todolistId)
            .then(res => {
                dispatch(setTasksAC(todolistId, res.data.items))
            })
    }
}
export const removeTasksTC = (taskID: string, todolistID: string) => {
    return (dispatch: Dispatch) => {
        todolistsApi.removeTask(todolistID, taskID)
            .then(res => {
                dispatch(removeTaskAC(taskID, todolistID))
            })
    }
}
export const addTasksTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistsApi.addTask(todolistId, title)
        .then(res => {
            dispatch(addTaskAC(res.data.data.item))
        })
}

// export const updateTaskTC = (todolistId: string, taskId: string, title?: string, status?: TaskStatusesType) =>
//     (dispatch: Dispatch, getState: () => AppRootStateType) => {
//         const state = getState()
//         const task = state.tasks[todolistId].find(t => t.id === taskId)
//         if (!task) {
//             console.warn('task not found in the state')
//             return
//         }
//         const model: UpdateTaskType = {
//             title: title ? title : task.title,
//             status: status ? status : task.status,
//             description: task.description,
//             priority: task.priority,
//             startDate: task.startDate,
//             deadline: task.deadline,
//         }
//         todolistsApi.updateTask(todolistId, taskId, model)
//             .then(res => {
//                 dispatch(updateTaskAC(todolistId, taskId, res.data.data))
//             })
//     }




