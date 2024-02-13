import { Avatar, Box, Typography,TextField, Select, MenuItem, FormControl, InputLabel, Stack, FormControlLabel, FormGroup, Checkbox, Button} from '@mui/material'
import { Field, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import * as Yup from "yup";
import { LoadingButton } from '@mui/lab';
import { Link, useNavigate } from 'react-router-dom';
import {useFirestore} from '../hooks/useFirestore';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useUserContext } from '../context/UserContext';


const Eempleado = () => {

    const navigate=useNavigate();
    const {updateEmpleado}=useFirestore();
    const {dataEmpleado}=useUserContext();
    const [dataId, setDataId]=useState();

    if(!dataEmpleado){
        navigate('/empleados');
    }
    
    console.log('aca esta el dataEmpleado: ',dataEmpleado);
    console.log('la fecha: ',dataEmpleado[0].fecha_ingreso);
    
    useEffect(()=>{
      setDataId(dataEmpleado[0].id);
    },[])


    const onSubmit=async(values,{setSubmitting, setErrors})=>{
        console.log('submit',values)
        try{
            console.log('values: ',values);
            await updateEmpleado(values,dataId);
            navigate('/empleados');
        }catch(error){
          console.log(error);
        }finally{
          setSubmitting(false);
        }    
    }
    
        const validationSchema=Yup.object().shape({
            cuil: Yup.string().matches(/^\d{11}$/, 'El CUIL debe tener exactamente 11 dígitos numéricos').required("Cuil requerido"),
            apellido: Yup.string().required("Apellido es requerido"),
            nombres: Yup.string().required("Nombres es requerido"),
            categoria: Yup.string().required("Categoria es requerida")
        })  
        

  const categoryMappings = {
    0: 'Cadete',
    1: 'Aprendiz/Ayudante',
    2: 'Personal auxiliar',
    3: 'Personal con asignacion',
    4: 'Ayudante en gestion',
    5: 'Personal en gestion',
    6: 'Farmaceutico Art.7 A',
    7: 'Farmaceutico Art.7 B',
    8: 'Farmaceutico Art.7 C'
};

  const categorias = [
    'Cadete',
    'Aprendiz/Ayudante',
    'Personal auxiliar ',
    'Personal con asignacion',
    'Ayudante en gestion',
    'Personal en gestion',
    'Farmaceutico Art.7 A',
    'Farmaceutico Art.7 B',
    'Farmaceutico Art.7 C'
  ];
  

  return (

    <Box sx={{mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center"}}>
      <Avatar sx={{mx: "auto", bgcolor: "#111"}}>
        <HowToRegIcon />
      </Avatar>
      <Typography variant='h5' component="h1">
        Editar Empleado
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb"> 

        <Formik
          initialValues={{ cuil: dataEmpleado[0].cuil, apellido: dataEmpleado[0].apellido, nombres: dataEmpleado[0].nombres, categoria: categoryMappings[dataEmpleado[0].categoria], fechaingreso: dayjs(dataEmpleado[0].fecha_ingreso).format('YYYY-MM-DD'), fechaegreso: dataEmpleado[0].fecha_egreso===null ? null : dayjs(dataEmpleado[0].fecha_egreso).format('YYYY-MM-DD'), licencia: dataEmpleado[0].licencia, reducida: dataEmpleado[0].reducida, sindical: dataEmpleado[0].sindical }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {
            ({values, handleSubmit,handleChange,errors,touched,handleBlur,isSubmitting,setFieldValue})=>(
              // <form onSubmit={handleSubmit}>
              <Box onSubmit={handleSubmit} sx={{mt:1}} component="form">

                <TextField
                  placeholder='cuil' 
                  value={values.cuil} 
                  onChange={handleChange}
                  name="cuil"
                  onBlur={handleBlur}
                  id="cuil"
                  label="Ingrese Cuil sin guiones"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.cuil && touched.cuil}
                  helperText={errors.cuil && touched.cuil && errors.cuil}
                />
                <TextField
                  placeholder='apellido' 
                  value={values.apellido} 
                  onChange={handleChange}
                  name="apellido"
                  onBlur={handleBlur}
                  id="apellido"
                  label="Ingrese apellido"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.apellido && touched.apellido}
                  helperText={errors.apellido && touched.apellido && errors.apellido}
                />
                <TextField
                  placeholder='nombres' 
                  value={values.nombres} 
                  onChange={handleChange}
                  name="nombres"
                  onBlur={handleBlur}
                  id="nombres"
                  label="Ingrese nombres"
                  fullWidth
                  sx={{ mb: 3 }}
                  error={errors.nombres && touched.nombres}
                  helperText={errors.nombres && touched.nombres && errors.nombres}
                />
                <FormControl fullWidth
                >
                  <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                        <Select
                            labelId="categoria-label"
                            id="categoria"
                            name="categoria"
                            value={values.categoria}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Categoría"
                            sx={{ mb: 3}}
                            error={errors.categoria && touched.categoria}
                            autoWidth
                        >
                            {/* Opciones de categorías generadas dinámicamente */}
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria} value={categoria} selected={categorias[dataEmpleado[0].categoria] === categoria}>
                                {categoria}
                                </MenuItem>
                            ))}
                        </Select>
                </FormControl>   
                <Stack>
                  <Field 
                      sx={{ mb: 3}}
                      component={DesktopDatePicker}
                      name="fechaingreso"
                      label="fecha de ingreso"
                      value={dayjs(values.fechaingreso)} // Asegúrate de que el valor sea un objeto Date
                      onChange={(date) => setFieldValue('fechaingreso', dayjs(date).format('YYYY-MM-DD'))}
                  />
                </Stack> 
                <Stack>
                  <Field 
                      component={DesktopDatePicker}
                      name="fechaegreso"
                      label="fecha de egreso"
                      value={values.fechaegreso===null ? null : dayjs(values.fechaegreso)} // Asegúrate de que el valor sea un objeto Date
                      onChange={(date) => setFieldValue('fechaegreso', dayjs(date).format('YYYY-MM-DD'))}
                  />
                </Stack> 

                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={values.licencia} onChange={handleChange} name="licencia"/>} label="En licencia" />
                  <FormControlLabel control={<Checkbox checked={values.reducida} onChange={handleChange} name="reducida"/>} label="Jornada reducida" />
                  <FormControlLabel control={<Checkbox checked={values.sindical} onChange={handleChange} name="sindical"/>} label="Sindical " />
                </FormGroup>  
                <LoadingButton
                  type="submit"
                  disabled={isSubmitting} 
                  loading={isSubmitting}
                  variant='contained'
                  fullWidth
                  sx={{ mb: 1 }}
                >Registrar</LoadingButton>  
                <Button 
                  variant="contained" color="success"
                  component={Link}
                  fullWidth
                  sx={{ mt: 1}}
                  to='/empleados'
                >HOME</Button>  
              </Box>

            )

          }  
        </Formik>

        </LocalizationProvider>                
      </Box>  


  )
}

export default Eempleado
