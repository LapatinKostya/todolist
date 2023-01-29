import {useEffect} from "react"
import Grid from "@mui/material/Grid"
import {AddItemForm} from "../../components/AddItemForm/AddItemForm"
import {Todolist} from "./Todolist/Todolist"
import {Navigate} from "react-router-dom"
import {RequestStatusType} from "../Application/application-reducer"
import {authSelectors} from "../Auth"
import {todolistActions} from "./index";
import {useActions, useAppSelector} from "../../utils/redux-utils";


type TodolistsListPropsType = {
  appStatus: RequestStatusType
  demo?: boolean
}

export const TodolistsList = ({appStatus, demo}: TodolistsListPropsType) => {
  const todolists = useAppSelector(state => state.todolists)
  const tasks = useAppSelector(state => state.tasks)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

  const {
    addTodolist,
    fetchTodolists,
  } = useActions(todolistActions)


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
        <Grid container spacing={3} sx={{flexWrap: 'nowrap', overflowX: 'scroll', height: '100%'}}>
          {
            todolists.map(tl => {
              const allTodolistTasks = tasks[tl.id];
              return (
                  <Grid item key={tl.id}>
                    <Todolist
                        id={tl.id}
                        title={tl.title}
                        tasks={allTodolistTasks}
                        filter={tl.filter}
                        entityStatus={tl.entityStatus}
                        demo={demo}
                    />
                  </Grid>
              )
            })}
        </Grid>
      </>
  )
}