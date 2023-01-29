import axios from "axios";
import {
  AuthDataType,
  GetTaskResponseType,
  ResponseType,
  TaskType,
  TodolistType,
  UpdateTaskModelType,
  UserType
} from "./types";

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


// api
export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>('todo-lists')
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
  },
  updateTodolistTitle(id: string, newTitle: string) {
    return instance.put<ResponseType>(`todo-lists/${id}`, {title: newTitle})
  },

  getTasks(todolistId: string) {
    return instance.get<GetTaskResponseType>(`todo-lists/${todolistId}/tasks`)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title})
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  }
}

export const authAPI = {
  login(data: AuthDataType) {
    return instance.post<ResponseType<{ userId: number }>>(`auth/login`, data)
  },
  logOut() {
    return instance.delete<ResponseType>(`auth/login`)
  },
  me() {
    return instance.get<ResponseType<UserType>>(`auth/me`)
  }
}

