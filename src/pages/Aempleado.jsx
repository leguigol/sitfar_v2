import { Avatar, Box, Typography,TextField, Select, MenuItem, FormControl, InputLabel, Stack, FormControlLabel, FormGroup, Checkbox, Button} from '@mui/material'
import { Field, Formik } from 'formik'
import React from 'react'
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


const Aempleado = () => {

    const navigate=useNavigate();
    const {addDataE}=useFirestore();

    const onSubmit=async(values,{setSubmitting, setErrors})=>{
        console.log('submit',values)
        try{
            console.log(values);
            await addDataE(values);
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
    // fechaingreso: Yup.date().required("Fecha de ingreso es requerida")
    // .nullable()
    // .default(null, "Fecha de ingreso es requerida")
    // .test('not-empty', 'Fecha de ingreso es requerida', (value) => value !== null && value !== "")
  })

  const categorias = [
    'Cadete',
    'Aprendiz/Ayudante',
    'Personal auxiliar',
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
        Registrar Empleado
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb"> 

        <Formik
          initialValues={{ cuil: "", apellido: "", nombres: "", categoria: "", fechaingreso: null, licencia: false, reducida: false, sindical: true }}
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
                                <MenuItem key={categoria} value={categoria}>
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
                      value={dayjs(values.fechaingreso)} 
                      onChange={(date) => setFieldValue('fechaingreso', dayjs(date).format('YYYY-MM-DD'))}
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

export default Aempleado
