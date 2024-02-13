import { Avatar, Box, TextField, Typography } from '@mui/material'
import React from 'react'
import CalculateIcon from '@mui/icons-material/Calculate';
import { Formik } from 'formik';
import * as Yup from "yup";
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';

const Cuota = () => {

    const onSubmit=async(values,{setSubmitting, errors,touched,setErrors})=>{
      console.log('values', values);
      const mes=values.periodo.slice(0,2);
      const ano=values.periodo.slice(2);
      let Validation=true;
      if(mes<1 || mes>12){
        console.log('error de mes');
        Validation=false;
      }
      if(ano<20 || ano>29){ 
        console.log('error de ano');
        Validation=false;
      }
      setSubmitting(true);
      if(!Validation){
        Swal.fire("Error de formato de periodo!");
      }

    }


    const validationSchema = Yup.object().shape({
      periodo: Yup.string().matches(/^(0[1-9]|1[0-2])(1[9-9]|20)\d{2}$/, 'El formato debe ser mmaa válido'),
    });


    return (

    <Box sx={{mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center"}}>
      <Avatar sx={{mx: "auto", bgcolor: "#111"}}>
        <CalculateIcon />
      </Avatar>
      <Typography variant='h5' component="h1">
        CUOTA SINDICAL
      </Typography>

        <Formik
          initialValues={{periodo: ''}}
          // validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {
            ({values, handleSubmit,handleChange,errors,touched,handleBlur,isSubmitting,setFieldValue})=>(
              

              <Box onSubmit={handleSubmit} sx={{mt:1}} component="form">
                <TextField
                  placeholder='Ingrese Periodo' 
                  value={values.periodo} 
                  onChange={handleChange}
                  name="periodo"
                  onBlur={handleBlur}
                  id="periodo"
                  label="Ingrese Periodo (mmaa)"
                  sx={{ mb: 3 }}
                  error={errors.periodo && touched.periodo}
                  helperText={errors.periodo && touched.periodo && errors.periodo}
                />
                <LoadingButton
                  type="submit"
                  disabled={isSubmitting} 
                  loading={isSubmitting}
                  variant='contained'
                  fullWidth
                  sx={{ mb: 1 }}
                >Generar</LoadingButton>  

              </Box>
            )}           
         </Formik>
    </Box>     
    )
}

export default Cuota
