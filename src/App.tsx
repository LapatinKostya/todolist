import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";

export type filterType = 'all' | 'active' | 'completed'

function App() {
    let [tasks, setTasks] = useState([
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "ReactJS", isDone: false},
        {id: 4, title: "Redux", isDone: false}
    ])

    const removeTask = (id: number) => {
        tasks = tasks.filter(el => el.id !== id)
        setTasks(tasks)
    }
    let [filter, setFilter] = useState<filterType>('all')


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
            />
        </div>
    );
}

export default App;
