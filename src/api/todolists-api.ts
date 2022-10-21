import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '9172f965-4bc9-4cda-9d4d-05c9c625247d',
    },
}

type TodolistType = {
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

type CreateTodoDataType = {
    item: TodolistType
}

export const todolistsApi = {
    getTodolists() {
        return axios
            .get<TodolistType[]>(
                'https://social-network.samuraijs.com/api/1.1/todo-lists',
                settings,
            )
    },
    createTodolist(tidoTitle: string) {
        return axios
            .post<ResponseType<CreateTodoDataType>>(
                'https://social-network.samuraijs.com/api/1.1/todo-lists',
                {title: tidoTitle},
                settings,
            )
    },
    deleteTodolist(todolistID: string) {
        return axios
            .delete<ResponseType<{}>>(
                `https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}`,
                settings,
            )
    },
    updateTodolistTitle(todolistID: string, tidoTitle: string) {
        return axios
            .put<ResponseType<{}>>(
                `https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistID}`,
                {title: tidoTitle},
                settings,
            )
    },
}