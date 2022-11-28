import React, {useEffect, useState} from 'react'
import {TaskPriorities, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";

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
        todolistsAPI.createTask(todolistId, title)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


export const DeleteTask = () => {

    const [state, setState] = useState<any>(null)
    const todolistId = '9bbd13a2-e002-4460-9393-4589c203530b'
    const taskId = 'e2451c04-0b2d-45a2-891b-f302124164bd'
    useEffect(() => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then((res) => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const model: UpdateTaskModelType = {
        title: '123',
        description: '123',
        status: TaskPriorities.Completed,
        priority: 0,
        startDate: '',
        deadline: '',
    }
    const todolistId = '9bbd13a2-e002-4460-9393-4589c203530b'
    const taskId = '79a3965e-74d6-4f0b-a0e2-0fc5d04007fd'
    useEffect(() => {
        todolistsAPI.updateTask(todolistId, taskId, model)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

