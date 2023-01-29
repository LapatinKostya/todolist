import React, {useEffect} from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from 'react-router-dom'
import {useAppSelector} from "../utils/hooks/useAppSelector"
import {CircularProgress} from "@mui/material"
import {authSelectors, Login} from "../features/Auth"
import {appSelectors} from "./index"
import {useActions} from "../utils/hooks/useActions"
import {TodolistsList} from "../features/TodolistsList";


type PropsType = {
  demo?: boolean
}

const App = ({demo = false}: PropsType) => {
  const appStatus = useAppSelector(appSelectors.selectStatus)
  const isInitialized = useAppSelector(appSelectors.selectIsInitialized)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

  const {initialiseApp, logOut} = useActions()

  useEffect(() => {
    if (!demo) {
      initialiseApp()
    }
  }, [])
  const logOutHandler = () => {
    logOut()
  }

  if (!isInitialized) {
    return <div
        style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }
  return (
      <div className="App">
        <ErrorSnackbar/>
        <AppBar position="static">
          <Toolbar>
            {isLoggedIn && <Button onClick={logOutHandler} color="inherit">Logout</Button>}
          </Toolbar>
          {appStatus === 'loading' && <LinearProgress/>}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path='/' element={<Navigate to={'/todolist'}/>}/>
            <Route path='/todolist' element={<TodolistsList appStatus={appStatus} demo={demo}/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
            <Route path='*' element={<Navigate to='/404'/>}/>
          </Routes>
        </Container>
      </div>
  );
}

export default App;
