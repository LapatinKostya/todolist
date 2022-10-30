import React, {useEffect, useState} from 'react'
import {TaskStatusesType, todolistsApi, UpdateTaskType} from "../api/todolists-api";

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
    const [title, setTitle] = useState<string>('')

    const createTodolist = () => {
        todolistsApi.createTodolist(title)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'new title'} onChange={e => setTitle(e.currentTarget.value)}/>
            <button onClick={createTodolist}>create todolist</button>
        </div>
    </div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistID, setTodolistID] = useState<string>('')

    const deleteTodolist = () => {
        todolistsApi.deleteTodolist(todolistID)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} onChange={e => setTodolistID(e.currentTarget.value)}/>
            <button onClick={deleteTodolist}>delete todolist</button>
        </div>
    </div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todolistID, setTodolistID] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const changeTodolistTitle = () => {
        todolistsApi.updateTodolistTitle(todolistID, title)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} onChange={e => setTodolistID(e.currentTarget.value)}/>
            <input placeholder={'new title'} onChange={e => setTitle(e.currentTarget.value)}/>
            <button onClick={changeTodolistTitle}>change todolist title</button>
        </div>
    </div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistID, setTodolistID] = useState<string>('')

    const getTask = () => {
        todolistsApi.getTasks(todolistID)
            .then((res) => {
                setState(res.data.items)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} onChange={e => setTodolistID(e.currentTarget.value)}/>
            <button onClick={getTask}>get tasks</button>
        </div>
    </div>
}

export const AddTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistID, setTodolistID] = useState<string>('')
    const [taskTitle, setTaskTitle] = useState<string>('')

    const addTask = () => {
        todolistsApi.addTask(todolistID, taskTitle)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} onChange={e => setTodolistID(e.currentTarget.value)}/>
            <input placeholder={'new title'} onChange={e => setTaskTitle(e.currentTarget.value)}/>
            <button onClick={addTask}>add task</button>
        </div>
    </div>
}
export const RemoveTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistID, setTodolistID] = useState<string>('')
    const [taskID, setTaskID] = useState<string>('')

    const deleteTask = () => {
        todolistsApi.removeTask(todolistID, taskID)
            .then((res) => {
                setState(res.data.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
            <input placeholder={'taskId'} onChange={(e) => setTaskID(e.currentTarget.value)}/>
            <button onClick={deleteTask}>delete task</button>
        </div>
    </div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistID, setTodolistID] = useState<string>('')
    const [taskID, setTaskID] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [status, setStatus] = useState<TaskStatusesType>(1)

    const model: UpdateTaskType = {
        title: title,
        description: '',
        status: status,
        priority: 1,
        startDate: '',
        deadline: '',
    }

    const updateTask = () => {
        todolistsApi.updateTask(todolistID, taskID, model)
            .then((res) => {
                setState(res.data.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
            <input placeholder={'taskId'} onChange={(e) => setTaskID(e.currentTarget.value)}/>
            <input placeholder={'new task title'} onChange={(e) => setTitle(e.currentTarget.value)}/>
            <select onChange={e => setStatus(Number(e.currentTarget.value))}>
                <option disabled selected>change status</option>
                <option value={0}>NEW</option>
                <option value={1}>InProgress</option>
                <option value={2}>Completed</option>
                <option value={3}>Draft</option>
            </select>

            <button onClick={updateTask}>update task</button>
        </div>
    </div>
}