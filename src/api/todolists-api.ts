import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'api-key': '3e45b67f-ef08-42fa-bfe6-461da76b065c'
    }
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
type ResponseType<D> = {
    resultCode: number
    messages: string[]
    data: D
}

export enum TaskPriorities {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export type TaskType = {
    description: string
    title: string
    status: TaskPriorities
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type GetTaskResponseType = {
    items: TaskType[]
    totalCount: number
    error: string | null
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskPriorities
    priority: number
    startDate: string
    deadline: string
}

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${todolistId}`)
    },
    updateTodolistTitle(id: string, newTitle: string) {
        return instance.put<ResponseType<{}>>(`todo-lists/${id}`, {title: newTitle})
    },

    getTasks(todolistId: string) {
        return instance.get<GetTaskResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}