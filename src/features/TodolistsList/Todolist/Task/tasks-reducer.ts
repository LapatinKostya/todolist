import {AddTodolistAT, RemoveTodolistAT, SetTodolistsAT} from '../todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../../../api/todolists-api";
import {AppRootStateType, AppThunk} from "../../../../app/store";
import {setAppStatusAC} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionTypes): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? action.task : t)
            }
        case 'SET-TODOLISTS':
            const stateCopy = {...state}
            action.todolists.forEach(t => {
                stateCopy[t.id] = []
            })
            return stateCopy
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state;
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)
export const addTaskAC = (todolistId: string, task: TaskType) =>
    ({type: 'ADD-TASK', todolistId, task} as const)
export const setTasksAC = (todolistId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', todolistId, tasks} as const)
export const updateTaskAC = (todolistId: string, taskId: string, task: TaskType) =>
    ({type: 'UPDATE-TASK', todolistId, taskId, task} as const)

// thunks
export const setTasksTC = (todolistId: string): AppThunk =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(todolistId, res.data.items))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
export const removeTasksTC = (todolistId: string, taskId: string): AppThunk =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.deleteTask(todolistId, taskId)
            .then(() => {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            })

    }
export const createTasksTC = (todolistId: string, title: string): AppThunk =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(todolistId, res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
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
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
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
export type TasksStateType = {
    [key: string]: TaskType[]
}
type SetTaskAT = ReturnType<typeof setTasksAC>
type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type UpdateTaskAT = ReturnType<typeof updateTaskAC>
export type TasksActionTypes =
    | AddTodolistAT
    | RemoveTodolistAT
    | SetTodolistsAT
    | SetTaskAT
    | RemoveTaskAT
    | AddTaskAT
    | UpdateTaskAT



