import React, {useEffect} from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import {Menu} from '@mui/icons-material'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import LinearProgress from '@mui/material/LinearProgress'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {useAppDispatch, useAppSelector} from "./store";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {logOutTC, meTC} from "../features/Login/auth-reducer";
import {CircularProgress} from "@mui/material";


function App() {
    const appStatus = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()
    const logOut = () => {
        dispatch(logOutTC())
    }

    useEffect(() => {
        dispatch(meTC())
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
                    {/*<IconButton edge="start" color="inherit" aria-label="menu">*/}
                    {/*    <Menu/>*/}
                    {/*</IconButton>*/}
                    {/*<Typography variant="h6">*/}
                    {/*    News*/}
                    {/*</Typography>*/}
                    {isLoggedIn && <Button onClick={logOut} color="inherit">Logout</Button>}
                </Toolbar>
                {appStatus === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList appStatus={appStatus}/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path='*' element={<Navigate to='/404'/>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
