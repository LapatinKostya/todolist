import {filterType, TodolistType} from "../App";
import {v1} from "uuid";

type RemoveTodolistAT = {
    type: 'REMOVE-TODOLIST'
    id: string
}
type AddTodolistAT = {
    type: 'ADD-TODOLIST'
    title: string
}
type ChangeTodolistTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
type ChangeTodolistFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: filterType
}

type ActionType =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodolistTitleAT
    | ChangeTodolistFilterAT


export const todolistsReducer = (state: Array<TodolistType>, action: ActionType) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.id)
        case 'ADD-TODOLIST':
            const todolist: TodolistType = {id: v1(), title: action.title, filter: 'all'}
            // setTasks({...tasks, [todolist.id]: []})
            return ([...state, todolist])
        case 'CHANGE-TODOLIST-TITLE':
            return state.map((el => (el.id === action.id ? {...el, title: action.title} : el)))
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => (el.id === action.id ? {...el, filter: action.filter} : el))
        default:
            throw new Error('i don\'t understand')
    }
}
export const RemoveTodolistAC = (id: string): RemoveTodolistAT => {
    return {type: 'REMOVE-TODOLIST', id}
}
export const AddTodolistAC = (title: string): AddTodolistAT => {
    return {type: 'ADD-TODOLIST', title: title}
}
export const ChangeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleAT => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title}
}
export const ChangeTodolistFilterAC = (id: string, filter: filterType): ChangeTodolistFilterAT => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter}
}
