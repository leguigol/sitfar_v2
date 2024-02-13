import React, { useState, useEffect } from 'react'
import { login,passwordReset } from '../config/firebase';
import { Link, useNavigate} from 'react-router-dom';
import { useUserContext} from '../context/UserContext';
import { Formik } from 'formik';
import * as Yup from "yup";
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';

const Login = () => {

  const [email, setEmail]=useState('')
  const {user, setUser}=useUserContext();

  // const [password, setPassword]=useState('')

  const navigate=useNavigate();
  // const {user}=useUserContext();


  // const handleSubmit= async(e)=>{
  //   e.preventDefault();
  //   console.log('me diste a submit');
  //   try{
  //     const credentialUser=await login({email,password});
  //     console.log(credentialUser);
  //   }catch(error){
  //     console.log(error);
  //   }
  // }

  const onSubmit=async({email, password},{setSubmitting, setErrors})=>{
    console.log({email,password});
    try{
      const credentialUser=await login({email,password});
      const userInformation = {
        uid: credentialUser.user.uid,
        email: credentialUser.user.email,
      };
      setUser(userInformation);
      navigate('/dashboard');
      //console.log(credentialUser);
    }catch(error){
      console.log({error});
      // console.log("codigo: ",error.code);
      // console.log("mensaje: ",error.message);
      if(error.code==="auth/user-not-found"){
        setErrors({email: "Usuario no registrado"});
      }
      if(error.code==="auth/wrong-password"){
        setErrors({password: "Password invalido"});
      }
      if(error.code==="auth/too-many-requests"){
        setErrors({email: "Cuenta deshabilitada momentaneamente, demasiados intentos fallidos"});
      }
    }finally{
      setSubmitting(false);
    }
    
  }

  const handleResetPassword = async (mail) => {
    try{
      const result = await passwordReset(mail);
      Swal.fire("Email de restablecimiento de contraseña enviado !")
    }catch(error){
      console.log(error);
    }   

  }

  const validationSchema=Yup.object().shape({
    email: Yup.string().email("Email no valido").required("Email requerido"),
    password: Yup.string().trim().min(6,"Minimo 6 caracteres").required("Password requerido")
  })

  return (
    <>
    <Box sx={{mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center"}}>
      <Avatar sx={{mx: "auto", bgcolor: "#111"}}>
        <AddAPhotoIcon />
      </Avatar>
      <Typography variant='h5' component="h1">
        Login
      </Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {
            ({values, handleSubmit,handleChange,errors,touched,handleBlur,isSubmitting})=>(
              // <form onSubmit={handleSubmit}>
              <Box onSubmit={handleSubmit} sx={{mt:1}} component="form">

                <TextField
                  placeholder='test@example.com' 
                  value={values.email} 
                  onChange={handleChange}
                  name="email"
                  onBlur={handleBlur}
                  id="email"
                  label="Ingrese Email"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.email && touched.email}
                  helperText={errors.email && touched.email && errors.email}
                />
                {/* <input type="text" 
                  placeholder='Ingrese email' 
                  value={values.email} 
                  onChange={handleChange}
                  name="email"
                  onBlur={handleBlur}
                />
                {
                  errors.email && touched.email && errors.email
                } */}
                <TextField
                  placeholder='Ingrese contraseña' 
                  autoComplete='on' 
                  value={values.password} 
                  onChange={handleChange}
                  name="password"
                  onBlur={handleBlur}
                  id="password"
                  label="Ingrese Contraseña"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.password && touched.password}
                  helperText={errors.password && touched.password && errors.password}
                />
                {/* <input type="password" 
                  placeholder='Ingrese contraseña' 
                  autoComplete='on' 
                  value={values.password} 
                  onChange={handleChange}
                  name="password"
                  onBlur={handleBlur}
                /> */}
                {/* {
                  errors.password && touched.password && errors.password
                } */}

                <LoadingButton
                  type="submit"
                  disabled={isSubmitting} 
                  loading={isSubmitting}
                  variant='contained'
                  fullWidth
                  sx={{ mb: 3 }}
                >Login</LoadingButton>  

                <Button 
                  fullWidth
                  component={Link}
                  to="/register"
                >No tienes una cuenta ? Registrate</Button>  

                <Button onClick={()=>handleResetPassword(values.email)} variant="contained">
                   Restablecer Contraseña
                </Button>
                 {/* <button type="submit" >Login</button> */}
              {/* </form> */}
              </Box>

            )

          }  
        </Formik>
      </Box>  
    </>
  )
}

export default Login
