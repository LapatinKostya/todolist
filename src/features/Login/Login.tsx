import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {Navigate} from "react-router-dom";
import {login} from "./auth-reducer";
import {useAppDispatch} from "../../utils/hooks/useAppDispatch";
import {useAppSelector} from "../../utils/hooks/useAppSelector";

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

type TFormValues = {
  email: string
  password: string
  rememberMe: boolean
}
export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }
      if (values.password.length < 3) {
        errors.password = 'min password length 3'
      }
      return errors
    },

    onSubmit: async (values, formikHelpers: FormikHelpers<TFormValues>) => {
      const action = await dispatch(login(values))
      if(login.rejected.match(action)){
        if(action.payload?.fieldsErrors?.length){
          const error = action.payload?.fieldsErrors[0]
          formikHelpers.setFieldError(error.field ,error.error)
        }
      }
    },
  })

  if (isLoggedIn) {
    console.log(isLoggedIn)
    return <Navigate to={'/'}/>

  }

  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <form onSubmit={formik.handleSubmit}>
          <FormLabel>
            <p>To log in get registered
              <a href={'https://social-network.samuraijs.com/'}
                 target={'_blank'} rel="noreferrer"> here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <FormGroup>
            <TextField
                label="Email"
                margin="normal"
                {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
            <TextField
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
            <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                      {...formik.getFieldProps('rememberMe')}
                  />}
            />
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  </Grid>
}