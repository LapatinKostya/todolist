import React, {useState} from 'react';
import './App.css';
import {TasksType, Todolist} from "./components/Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";

export type filterType = 'all' | 'active' | 'completed'
export type TodolistType = {
    id: string
    title: string
    filter: filterType
}
export type TaskStateType = {
    [key: string]: Array<TasksType>
}

function App() {
    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistId1, title: 'What to learn', filter: 'all'},
        {id: todolistId2, title: 'What to bye', filter: 'all'},
    ])

    const addTodoList = (title: string) => {
        const todolist: TodolistType = {id: v1(), title: title, filter: 'all'}
        setTodolists([todolist, ...todolists])
        setTasks({...tasks, [todolist.id]: []})
    }
    const removeTodolist = (todoId: string) => {
        setTodolists(todolists.filter(el => el.id !== todoId))
        delete tasks[todoId]
        setTasks({...tasks})
    }
    const changeFilter = (value: filterType, toDoId: string) => {
        setTodolists(todolists.map(el => (el.id === toDoId ? {...el, filter: value} : el)))
    }
    const changeTodolistTitle = (todoId: string, value: string) => {
        const todolist = todolists.find(t => t.id === todoId)
        if (todolist) {
            todolist.title = value
            setTodolists([...todolists])
        }
    }

    const [tasks, setTasks] = useState<TaskStateType>({
        [todolistId1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'ReactJS', isDone: true},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphQL', isDone: false}
        ],
        [todolistId2]: [
            {id: v1(), title: 'bread', isDone: true},
            {id: v1(), title: 'milk', isDone: true},
            {id: v1(), title: 'book', isDone: false},
        ]
    })

    const removeTask = (toDoId: string, id: string) => {
        const filteredTasks = tasks[toDoId].filter(el => el.id !== id)
        setTasks({...tasks, [toDoId]: filteredTasks})
    }
    const addTask = (toDoId: string, task: string) => {
        const newTask = {id: v1(), title: task, isDone: false}
        setTasks({...tasks, [toDoId]: [newTask, ...tasks[toDoId]]});
    }
    const changeTaskStatus = (toDoId: string, id: string, isDone: boolean) => {
        let task = tasks[toDoId].find(t => (t.id === id))
        if (task) {
            task.isDone = isDone
            setTasks({...tasks})
        }
    }
    const changeTaskTitle = (todoId: string, taskId: string, value: string) => {
        const task = tasks[todoId].find(t => (t.id === taskId))
        if (task) {
            task.title = value
            setTasks({...tasks})
        }
    }

    return (
        <div className="App">

            <AddItemForm addItem={addTodoList}/>

            {todolists.map((tl) => {

                let tasksForTodolist = tasks[tl.id]

                if (tl.filter === 'active') {
                    tasksForTodolist = tasksForTodolist.filter(el => !el.isDone)
                }
                if (tl.filter === 'completed') {
                    tasksForTodolist = tasksForTodolist.filter(el => el.isDone)
                }

                return (
                    <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                )
            })}
        </div>
    );
}

export default App;
