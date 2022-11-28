import {AddTodolistAT, RemoveTodolistAT, SetTodolistsAT} from './todolists-reducer';
import {TaskPriorities, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK'
    todolistId: string
    task: TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskPriorities
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    todolistId: string
    taskId: string
    title: string
}

export type SetTasksAT = {
    type: 'SET-TASKS'
    tasks: TaskType[]
    todolistId: string
}
type changeTaskAT = ReturnType<typeof changeTaskAC>

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistAT
    | RemoveTodolistAT
    | SetTodolistsAT
    | SetTasksAT
    | changeTaskAT

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach(t => {
                stateCopy[t.id] = []
            })
            return stateCopy
        }
        case 'SET-TASKS': {
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        }
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        }
        case 'ADD-TASK': {
            return {
                ...state,
                [action.todolistId]: [action.task, ...state[action.todolistId]]
            }
        }
        case "CHANGE-TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? action.task : t)
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
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (todolistId: string, task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', todolistId, task}
}
export const setTaskAC = (todolistId: string, tasks: TaskType[]): SetTasksAT => {
    return {type: 'SET-TASKS', todolistId, tasks}
}
export const changeTaskAC = (todolistId: string, taskId: string, task: TaskType) => {
    return {type: 'CHANGE-TASK', todolistId, taskId, task} as const
}
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTaskAC(todolistId, res.data.items))
        })
}
export const removeTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(() => dispatch(removeTaskAC(taskId, todolistId)))
}
export const createTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todolistId, title)
        .then((res) => dispatch(addTaskAC(todolistId, res.data.data.item)))
}

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskPriorities
    priority?: number
    startDate?: string
    deadline?: string
}
export const updateTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
            .then((res) => dispatch(changeTaskAC(todolistId, taskId, res.data.data.item)))
    }



