import React, {useEffect, useState} from 'react'
import {todolistsAPI} from "../api/todolists-api";

export default {
    title: 'API'
}


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const todolistId = '9bbd13a2-e002-4460-9393-4589c203530b'
        todolistsAPI.getTasks(todolistId)
            .then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const AddTask = () => {

    const [state, setState] = useState<any>(null)
    const todolistId = '9bbd13a2-e002-4460-9393-4589c203530b'
    const title = 'new title'
    useEffect(() => {
        todolistsAPI.addTask(todolistId, title)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


export const DeleteTask = () => {

    const [state, setState] = useState<any>(null)
    const todolistId = '9bbd13a2-e002-4460-9393-4589c203530b'
    const taskId = 'ffdc63f2-ab6a-4625-8464-2f5699872ceb'
    useEffect(() => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const model = {
        title: '123',
        description: '123',
        status: 0,
        priority: 0,
    }
    const todolistId = '9bbd13a2-e002-4460-9393-4589c203530b'
    const taskId = 'e230a6c1-de17-4d10-bb47-546965dfe9cb'
    useEffect(() => {
        todolistsAPI.updateTask(todolistId, taskId, model)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

