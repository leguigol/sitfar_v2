import { Avatar, Box, Button, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import * as Yup from "yup";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {useFirestore} from '../hooks/useFirestore';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { LoadingButton } from '@mui/lab';

const RegistroFarmacia = () => {

  const {user, setUser,cuit,razon}=useUserContext();
  const {data,error,loading,getDataFarmacia,addDataF}=useFirestore();
  const navigate=useNavigate();

  useEffect(()=>{
    getDataFarmacia();
  },[])

  if(loading) return <p>Loading data....</p>
  if(error) return <p>Error</p>

  const onSubmit=async(values,{setSubmitting, setErrors})=>{
    console.log(values);
    try{
      await addDataF(values);
    }catch(error){
      console.log({error});
    }finally{
      setSubmitting(false);
    }    
  }


  const validationSchema=Yup.object().shape({
    cuit: Yup.string().matches(/^\d{11}$/, 'El CUIT debe tener exactamente 11 dígitos numéricos').required("Cuit requerido"),
    razon: Yup.string().required("Razon Social requerido"),
    domicilio: Yup.string().required("Domicilio requerido"),
    localidad: Yup.string().required("Localidad requerida"),
    telefono: Yup.string().required("Telefono requerido"),
    email: Yup.string().email("Email no valido").required("Email requerido")
  })

  return (
    <>
      <div>
      {data.length>0 ? (
        data.map((item) => (
          <div key={item.id}>
            <p>{item.cuit}</p>
            <p>{item.razonsocial}</p>
          </div>
        ))
      ) : (

    <Box sx={{mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center"}}>
      <Avatar sx={{mx: "auto", bgcolor: "#111"}}>
        <HowToRegIcon />
      </Avatar>
      <Typography variant='h5' component="h1">
        Registrar Farmacia
      </Typography>
        <Formik
          initialValues={{ cuit: "", razon: "", domicilio: "", localidad: "", telefono: "", email: "" }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {
            ({values, handleSubmit,handleChange,errors,touched,handleBlur,isSubmitting})=>(
              // <form onSubmit={handleSubmit}>
              <Box onSubmit={handleSubmit} sx={{mt:1}} component="form">

                <TextField
                  placeholder='cuit' 
                  value={values.cuit} 
                  onChange={handleChange}
                  name="cuit"
                  onBlur={handleBlur}
                  id="cuit"
                  label="Ingrese Cuit"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.cuit && touched.cuit}
                  helperText={errors.cuit && touched.cuit && errors.cuit}
                />
                <TextField
                  placeholder='razon social' 
                  value={values.razon} 
                  onChange={handleChange}
                  name="razon"
                  onBlur={handleBlur}
                  id="razon"
                  label="Ingrese Razon Social"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.razon && touched.razon}
                  helperText={errors.razon && touched.razon && errors.razon}
                />
                <TextField
                  placeholder='domicilio' 
                  value={values.domicilio} 
                  onChange={handleChange}
                  name="domicilio"
                  onBlur={handleBlur}
                  id="domicilio"
                  label="Ingrese domicilio"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.domicilio && touched.domicilio}
                  helperText={errors.domicilio && touched.domicilio && errors.domicilio}
                />
                <TextField
                  placeholder='localidad' 
                  value={values.localidad} 
                  onChange={handleChange}
                  name="localidad"
                  onBlur={handleBlur}
                  id="localidad"
                  label="Ingrese localidad"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.localidad && touched.localidad}
                  helperText={errors.localidad && touched.localidad && errors.localidad}
                />
                <TextField
                  placeholder='telefono' 
                  value={values.telefono} 
                  onChange={handleChange}
                  name="telefono"
                  onBlur={handleBlur}
                  id="telefono"
                  label="Ingrese telefono"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.telefono && touched.telefono}
                  helperText={errors.telefono && touched.telefono && errors.telefono}
                />

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
                <LoadingButton
                  type="submit"
                  disabled={isSubmitting} 
                  loading={isSubmitting}
                  variant='contained'
                  fullWidth
                  sx={{ mb: 3 }}
                >Registrar</LoadingButton>  

              </Box>

            )

          }  
        </Formik>
      </Box>  


      )}
      </div>
    </>
  )
}

export default RegistroFarmacia
    