import {todolistsAPI, TodolistType} from "../../../api/todolists-api";
import {AppThunk} from "../../../app/store";
import {RequestStatusType, setAppStatusAC, setAppErrorAC} from "../../../app/app-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionTypes): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", entityStatus: 'idle'}, ...state]
        case 'UPDATE-TODOLIST-TITLE':
            return state.map(t => t.id === action.id ? {...t, title: action.title} : t)
        case 'UPDATE-TODOLIST-FILTER':
            return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        case 'SET-TODOLISTS' :
            return action.todolists.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return  state.map(t=> t.id === action.id? {...t, entityStatus: action.entityStatus}: t)
        default:
            return state;
    }
}

// actions
export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)
export const updateTodolistTitleAC = (id: string, title: string) =>
    ({type: 'UPDATE-TODOLIST-TITLE', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'UPDATE-TODOLIST-FILTER', id, filter} as const)
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const)

// thunks
// export const setTodolistsTC = (): AppThunk =>
//     (dispatch) => {
//         todolistsAPI.getTodolists()
//             .then((res) => {
//                 dispatch(setTodolistAC(res.data))
//             })
//     }
export const setTodolistsTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC("succeeded"))
    } catch (e) {
        dispatch(setAppStatusAC("failed"))
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk =>
    (dispatch) => {
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then(() => {
                dispatch(removeTodolistAC(todolistId))
                dispatch(changeTodolistEntityStatusAC(todolistId, "succeeded"))
            })

    }
export const addTodolistTC = (title: string): AppThunk =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setAppStatusAC("succeeded"))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setAppErrorAC('some error'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }

            })
    }
export const updateTodolistTitleTC = (todolistId: string, title: string): AppThunk =>
    (dispatch) => {
        todolistsAPI.updateTodolistTitle(todolistId, title)
            .then(() => {
                dispatch(updateTodolistTitleAC(todolistId, title))
            })
    }

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType

}
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>
type UpdateTodolistTitleAT = ReturnType<typeof updateTodolistTitleAC>
type ChangeTodolistEntityStatusAT = ReturnType<typeof changeTodolistEntityStatusAC>
export type TodolistsActionTypes =
    | RemoveTodolistAT
    | AddTodolistAT
    | SetTodolistsAT
    | UpdateTodolistTitleAT
    | ChangeTodolistFilterAT
    | ChangeTodolistEntityStatusAT




