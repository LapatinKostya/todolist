import {useEffect} from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from 'react-router-dom'
import {CircularProgress} from "@mui/material"
import {authActions, authSelectors, Login} from "../features/Auth"
import {TodolistsList} from "../features/TodolistsList"
import {appActions, appSelectors} from "../features/Application";
import {useActions, useAppSelector} from "../utils/redux-utils";

type PropsType = {
  demo?: boolean
}

const App = ({demo = false}: PropsType) => {
  const appStatus = useAppSelector(appSelectors.selectStatus)
  const isInitialized = useAppSelector(appSelectors.selectIsInitialized)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

  const {initialiseApp} = useActions(appActions)
  const {logOut} = useActions(authActions)

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
