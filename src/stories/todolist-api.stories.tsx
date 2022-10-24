import React, {useEffect, useState} from 'react'
import {todolistsApi} from "../api/todolists-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.getTodolists()
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.createTodolist('Redux')
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.deleteTodolist('bf22f804-eb92-40e6-9088-80711089b1e2')
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const todolistID = '317b3763-7a88-492a-9a16-c98ed449fea0'
    useEffect(() => {
        todolistsApi.updateTodolistTitle(todolistID, 'Testing')
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistID = 'bb3a2d87-eac5-439c-ab18-c3f67efb1baa'
    useEffect(() => {
        todolistsApi.getTasks(todolistID)
            .then((res) => {
                setState(res.data.items)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const AddTask = () => {
    const [state, setState] = useState<any>(null)
    const todolistID = 'bb3a2d87-eac5-439c-ab18-c3f67efb1baa'
    const taskTitle = 'Test'
    useEffect(() => {
        todolistsApi.addTask(todolistID, taskTitle)
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const RemoveTask = () => {
    const [state, setState] = useState<any>(null)
    const todolistID = 'bb3a2d87-eac5-439c-ab18-c3f67efb1baa'
    const taskID = '14dfe4e5-b2e9-40ef-b47f-dc1d22893898'
    useEffect(() => {
        todolistsApi.removeTask(todolistID, taskID)
            .then((res) => {
                setState(res.data.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const todolistID = 'bb3a2d87-eac5-439c-ab18-c3f67efb1baa'
    const taskID = 'd7c48a7d-8de2-4570-8f51-7a6e28ab29b7'
    const title = 'New Title Test'
    const status = 1
    const model = {
        title: title,
        description: '',
        status: status,
        priority: 1,
        startDate: '',
        deadline: '',
    }
    useEffect(() => {
        todolistsApi.updateTask(todolistID, taskID, model)
            .then((res) => {
                setState(res.data.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

