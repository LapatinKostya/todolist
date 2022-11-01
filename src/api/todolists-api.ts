import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '3e45b67f-ef08-42fa-bfe6-461da76b065c',
    },
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
}
type CreateTodoDataType = {
    item: TodolistType
}

export enum TaskStatusesType {
    NEW = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPrioritiesType {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatusesType
    priority: TaskPrioritiesType
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type GetTasksResponseType = {
    items: TaskType[]
    totalCount: number
    error: string | null
}

export type UpdateTaskType = {
    title: string
    description: string
    status: TaskStatusesType
    priority: TaskPrioritiesType
    startDate: string
    deadline: string
}

export const todolistsApi = {
    getTodolists() {
        return instance
            .get<TodolistType[]>('todo-lists')
    },
    createTodolist(tidoTitle: string) {
        return instance
            .post<ResponseType<CreateTodoDataType>>('todo-lists', {title: tidoTitle})
    },
    deleteTodolist(todolistID: string) {
        return instance
            .delete<ResponseType>(`todo-lists/${todolistID}`)
    },
    updateTodolistTitle(todolistID: string, tidoTitle: string) {
        return instance
            .put<ResponseType>(`todo-lists/${todolistID}`, {title: tidoTitle})
    },
    getTasks(todolistID: string) {
        return instance
            .get<GetTasksResponseType>(`todo-lists/${todolistID}/tasks`)
    },
    removeTask(todolistID: string, taskID: string) {
        return instance
            .delete<ResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`)
    },
    addTask(todolistID: string, taskTitle: string) {
        return instance
            .post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistID}/tasks`, {title: taskTitle})
    },
    updateTask(todolistID: string, taskID: string, model: UpdateTaskType) {
        return instance
            .put<ResponseType<{item: TaskType}>>(`todo-lists/${todolistID}/tasks/${taskID}`, model)
    },
}