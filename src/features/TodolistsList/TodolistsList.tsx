import {useEffect} from "react"
import Grid from "@mui/material/Grid"
import {AddItemForm} from "../../components/AddItemForm/AddItemForm"
import Paper from "@mui/material/Paper"
import {Todolist} from "./Todolist/Todolist"
import {Navigate} from "react-router-dom"
import {RequestStatusType} from "../../app/app-reducer"
import {useAppSelector} from "../../utils/hooks/useAppSelector"
import {authSelectors} from "../Auth"
import {useActions} from "../../utils/hooks/useActions"


type TodolistsListPropsType = {
  appStatus: RequestStatusType
  demo?: boolean
}

export const TodolistsList = ({appStatus, demo}: TodolistsListPropsType) => {
  const {
    addTodolist,
    fetchTodolists,
  } = useActions()

  const todolists = useAppSelector(state => state.todolists)
  const tasks = useAppSelector(state => state.tasks)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

  useEffect(() => {
    fetchTodolists()
  }, [])

  if (!isLoggedIn) {
    return <Navigate to={'/login'}/>
  }

  return (
      <>
        <Grid container style={{padding: '20px'}}>
          <AddItemForm addItem={addTodolist} disabled={appStatus === 'loading'}/>
        </Grid>
        <Grid container spacing={3}>
          {
            todolists.map(tl => {
              const allTodolistTasks = tasks[tl.id];
              return (
                  <Grid item key={tl.id}>
                    <Paper style={{padding: '10px'}}>
                      <Todolist
                          id={tl.id}
                          title={tl.title}
                          tasks={allTodolistTasks}
                          filter={tl.filter}
                          entityStatus={tl.entityStatus}
                          demo={demo}
                      />
                    </Paper>
                  </Grid>
              )
            })}
        </Grid>
      </>
  )
}