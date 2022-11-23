import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'api-key': '3e45b67f-ef08-42fa-bfe6-461da76b065c'
    }
}


export const todolistsAPI = {
    getTodolists() {
        return axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)
    },
    createTodolist(payload: any){
        return axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', payload, settings)
    },
    deleteTodolist(todolistId: string){
        return  axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, settings)
    },
    updateTodolistTitle(todolistId: string, payload: any){
        return  axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, payload, settings)
    }
}