import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {v1} from "uuid";

export type filterType = 'all' | 'active' | 'completed'

function App() {
    let [tasks, setTasks] = useState([
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
        {id: v1(), title: "Redux", isDone: false}
    ])

    let [filter, setFilter] = useState<filterType>('all')

    const removeTask = (id: string) => {
        tasks = tasks.filter(el => el.id !== id)
        setTasks(tasks)
    }

    const addTask = (task: string) => {
        const newTask = {id: v1(), title: task, isDone: false}
        setTasks([newTask, ...tasks])
    }

    const changeTaskStatus = (id: string, isDone: boolean) => {
        let task = tasks.find(t => (t.id === id))
        if (task) {
            task.isDone = isDone
            setTasks([...tasks])
        }
    }

    let tasksForTodolist = tasks

    if (filter === 'active') {
        tasksForTodolist = tasks.filter(el => !el.isDone)
    }
    if (filter === 'completed') {
        tasksForTodolist = tasks.filter(el => el.isDone)
    }
    const changeFilter = (type: filterType) => {
        setFilter(filter = type)
    }

    return (
        <div className="App">
            <Todolist
                title={'What to learn'}
                tasks={tasksForTodolist}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
                filter={filter}
            />
        </div>
    );
}

export default App;
