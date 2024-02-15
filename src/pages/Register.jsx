import React, { useEffect, useState } from 'react'
import { register } from '../config/firebase';
import useRedirectActiveUser from '../hooks/useRedirectActiveUser';
import { useUserContext } from '../context/UserContext';
import { Formik } from 'formik';
import * as Yup from "yup";
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { LoadingButton } from '@mui/lab';
import { Link } from 'react-router-dom';
import { useFirestore } from '../hooks/useFirestore';

const Register = () => {

  const [email, setEmail]=useState('')
  const [password, setPassword]=useState('')

  const {user}=useUserContext();
  const {data,error,loading}=useFirestore();

  useEffect(()=>{
    console.log(data);
  },[]);

  // const handleSubmit= async(e)=>{
  //   e.preventDefault();
  //   console.log('me diste a submit');
  //   try{
  //     const credentialUser=await register({email,password});
  //     console.log(credentialUser);
  //   }catch(error){
  //     console.log(error);
  //   }
  // }
  const onSubmit=async({email,password},{setSubmitting,setErrors,resetForm})=>{
    try{
      const credentialUser=await register({email,password});
      console.log(credentialUser);
    }catch(error){
      console.log(error);
    }
  }

  const validationSchema=Yup.object().shape({
    email: Yup.string().email("Email no valido").required("Email requerido"),
    password: Yup.string().trim().min(6,"Minimo 6 caracteres").required("Password requerido")
  })

  return (
    <Box sx={{mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center"}}>
        <Avatar sx={{ mx: "auto", bgcolor:"#111"}}>
           <AddAPhotoIcon />
        </Avatar>
        <Typography variant='h5' component="h1">
         Register
      </Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          { 
            ({values, handleSubmit,handleChange,errors,touched,handleBlur,isSubmitting})=>(
            // <form onSubmit={handleSubmit}>
            //   <input type="text" 
            //   placeholder='Ingrese email' 
            //   value={values.email} 
            //   onChange={handleChange}
            //   name="email"
            // />
            <Box onSubmit={handleSubmit} component="form" sx={{ mt: 1 }}>
                <TextField
                  placeholder='Ingrese email' 
                  value={values.email} 
                  onChange={handleChange}
                  name="email"
                  id="email"
                  label="Ingrese Email"
                  fullWidth
                  error={errors.email && touched.email}
                  helperText={errors.email && touched.email && errors.email}
                />
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
                  sx={{ mt: 3 }}
                  error={errors.password && touched.password}
                  helperText={errors.password && touched.password && errors.password}
                />
                    
                <LoadingButton
                  type="submit"
                  disabled={isSubmitting} 
                  loading={isSubmitting}
                  variant='contained'
                  fullWidth
                  sx={{ mt: 3 }}
                >Registrarse
                </LoadingButton>  
                <Button 
                  fullWidth
                  component={Link}
                  to="/"
                >Ya tienes cuenta ? Ingresa</Button>  
            </Box>
            )
          }
        </Formik>  
    </Box>
  )
}

export default Register
