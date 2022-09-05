import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistAT, RemoveTodolistAT} from "./todolists-reducer";

type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>

type ActionType =
    RemoveTaskAT
    | AddTaskAT
    | ChangeTaskStatusAT
    | ChangeTaskTitleAT
    | RemoveTodolistAT
    | AddTodolistAT

const initialState = {}

export const tasksReducer = (state: TaskStateType = initialState, action: ActionType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            const filteredTasks = state[action.todolistId].filter(el => el.id !== action.id)
            return {...state, [action.todolistId]: filteredTasks}
        case 'ADD-TASK':
            const newTask = {id: v1(), title: action.title, isDone: false}
            return {...state, [action.todolistId]: [newTask, ...state[action.todolistId]]}
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.id ? {
                    ...el,
                    isDone: action.isDone
                } : el)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.id ? {
                    ...el,
                    title: action.title
                } : el)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.id]: []}
        case 'REMOVE-TODOLIST':
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        default:
            return state
    }
}
export const removeTaskAC = (todolistId: string, id: string) => {
    return {type: 'REMOVE-TASK', todolistId, id} as const
}
export const addTaskAC = (todolistId: string, taskTitle: string) => {
    return {type: 'ADD-TASK', todolistId, title: taskTitle} as const
}
export const changeTaskStatusAC = (todolistId: string, id: string, isDone: boolean) => {
    return {type: 'CHANGE-TASK-STATUS', todolistId, id, isDone} as const
}
export const changeTaskTitleAC = (todolistId: string, id: string, title: string) => {
    return {type: 'CHANGE-TASK-TITLE', todolistId, id, title} as const
}