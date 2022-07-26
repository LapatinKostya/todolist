import {TaskStateType} from "../../App";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',

}
export type AddTaskActionType = {
    type: 'ADD-TASK',

}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',

}
export type ChangeTaskFilterActionType = {
    type: 'CHANGE-TASK-FILTER',

}
type ActionsType =
    RemoveTaskActionType |
    AddTaskActionType |
    ChangeTaskTitleActionType |
    ChangeTaskFilterActionType

export const taskReducer = (state: TaskStateType, action: ActionsType): TaskStateType => {

    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state}

        case 'ADD-TASK':
            return {...state}

        case 'CHANGE-TASK-TITLE':
            return {...state}

        case 'CHANGE-TASK-FILTER':
            return {...state}

        default:
            throw new Error('I don`t understand this action type')
    }
}

export const removeTaskAC = (): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK'}
}
export const addTaskAC = (): AddTaskActionType => {
    return {type: 'ADD-TASK'}
}
export const changeTaskTitleAC = (): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE'}
}
export const changeTaskFilterAC = (): ChangeTaskFilterActionType => {
    return {type: 'CHANGE-TASK-FILTER'}
}
