import {filterType, TodolistType} from "../App";
import {v1} from "uuid";

export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleAT = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>

type ActionType =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodolistTitleAT
    | ChangeTodolistFilterAT

export const todolistsReducer = (state: Array<TodolistType>, action: ActionType): Array<TodolistType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            // delete tasks[todoId]
            // setTasks({...tasks})
            return state.filter(el => el.id !== action.id)
        case 'ADD-TODOLIST':
            const todolist: TodolistType = {id: v1(), title: action.title, filter: 'all'}
            return ([...state, todolist])
        case 'CHANGE-TODOLIST-TITLE':
            return state.map((el => (el.id === action.id ? {...el, title: action.title} : el)))
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => (el.id === action.id ? {...el, filter: action.filter} : el))
        default:
            return state
    }
}
export const removeTodolistAC = (id: string) => {
    return {type: 'REMOVE-TODOLIST', id} as const
}
export const addTodolistAC = (title: string) => {
    return {type: 'ADD-TODOLIST', title: title} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title} as const
}
export const changeTodolistFilterAC = (id: string, filter: filterType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter} as const
}
