export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4
}

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type FieldErrorType = {
  field: string,
  error: string
}
export type ResponseType<D = {}> = {
  resultCode: number
  messages: string[]
  data: D
  fieldsErrors?: FieldErrorType[]
}
export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type GetTaskResponseType = {
  items: TaskType[]
  totalCount: number
  error: string | null
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: number
  startDate: string
  deadline: string
}
export type AuthDataType = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string

}
export type UserType = {
  id: number
  email: string
  login: string
}