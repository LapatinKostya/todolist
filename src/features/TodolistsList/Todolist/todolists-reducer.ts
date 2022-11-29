import {todolistsAPI, TodolistType} from "../../../api/todolists-api";
import {AppThunk} from "../../../app/store";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionTypes): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all"}, ...state]
        case 'UPDATE-TODOLIST-TITLE':
            return state.map(t => t.id === action.id ? {...t, title: action.title} : t)
        case 'UPDATE-TODOLIST-FILTER':
            return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        case 'SET-TODOLISTS' :
            return action.todolists.map(t => ({...t, filter: 'all'}))
        default:
            return state;
    }
}

// actions
export const setTodolistAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)
export const updateTodolistTitleAC = (id: string, title: string) =>
    ({type: 'UPDATE-TODOLIST-TITLE', id, title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'UPDATE-TODOLIST-FILTER', id, filter} as const)

// thunks
// export const setTodolistsTC = (): AppThunk =>
//     (dispatch) => {
//         todolistsAPI.getTodolists()
//             .then((res) => {
//                 dispatch(setTodolistAC(res.data))
//             })
//     }
export const setTodolistsTC = (): AppThunk => async dispatch => {
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolistAC(res.data))
    } catch (e) {
        console.warn(e)
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk =>
    (dispatch) => {
        todolistsAPI.deleteTodolist(todolistId)
            .then(() => {
                dispatch(removeTodolistAC(todolistId))

            })
    }
export const addTodolistTC = (title: string): AppThunk =>
    (dispatch) => {
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
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
}
export type SetTodolistsAT = ReturnType<typeof setTodolistAC>
export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
type UpdateTodolistTitleAT = ReturnType<typeof updateTodolistTitleAC>
export type TodolistsActionTypes =
    | RemoveTodolistAT
    | AddTodolistAT
    | SetTodolistsAT
    | UpdateTodolistTitleAT
    | ReturnType<typeof changeTodolistFilterAC>




