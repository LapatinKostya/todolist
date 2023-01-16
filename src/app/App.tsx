import React, {useEffect} from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {logOutTC, meTC} from "../features/Login/auth-reducer";
import {CircularProgress} from "@mui/material";
import {Navigate, Route, Routes} from 'react-router-dom'
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {Login} from "../features/Login/Login";
import {useAppSelector} from "../utils/hooks/useAppSelector";
import {useAppDispatch} from "../utils/hooks/useAppDispatch";

type PropsType = {
  demo?: boolean
}

function App({demo = false}: PropsType) {
  const appStatus = useAppSelector(state => state.app.status)
  const isInitialized = useAppSelector(state => state.app.isInitialized)
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  const logOut = () => {
    dispatch(logOutTC())
  }

  useEffect(() => {
    if (!demo) {
      dispatch(meTC())
    }
  }, [dispatch])

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
            {isLoggedIn && <Button onClick={logOut} color="inherit">Logout</Button>}
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
