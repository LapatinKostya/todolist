import React, {useEffect, useState} from 'react'
import {todolistsAPI} from "../api/todolists-api";

export default {
    title: 'API'
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistsAPI.getTodolists()
            .then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {

    const [state, setState] = useState<any>(null)
    const title = 'new title'
    useEffect(() => {
        todolistsAPI.createTodolist(title)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {

    const [state, setState] = useState<any>(null)
    const todolistId = '966b5271-8329-40cf-8f09-e06ff21de5fa'
    useEffect(() => {
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const newTitle = 'YESYES'
    const todolistId = '6212c96b-6251-4d89-9f05-fd6842c57fb5'
    useEffect(() => {
        todolistsAPI.updateTodolistTitle(todolistId, newTitle)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

