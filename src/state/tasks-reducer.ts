import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPrioritiesType, TaskStatusesType, TaskType, todolistsApi} from "../api/todolists-api";
import {Dispatch} from "redux";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}
export type AddTaskActionType = {
    type: 'ADD-TASK',
    todolistId: string
    title: string
}
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
export type setTasksAT = ReturnType<typeof setTasksAC>

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | setTasksAT


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
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                status: TaskStatusesType.NEW,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: TaskPrioritiesType.Low,
                startDate: '',
                todoListId: action.todolistId
            }
            return {
                ...state,
                [action.todolistId]: [newTask, ...state[action.todolistId]]

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
                [action.todolistId]: []
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
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
    return {type: 'ADD-TASK', title, todolistId}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatusesType, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => {
    return {type: 'SET-TASKS', todolistId, tasks} as const
}

export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsApi.getTasks(todolistId)
            .then(res => {
                dispatch(setTasksAC(todolistId, res.data.items))
            })
    }
}


