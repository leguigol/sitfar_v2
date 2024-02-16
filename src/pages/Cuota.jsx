import { Avatar, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Input } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import CalculateIcon from '@mui/icons-material/Calculate';
import { Formik } from 'formik';
import * as Yup from "yup";
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
import { useFirestore } from '../hooks/useFirestore';
import { useUserContext } from '../context/UserContext';

const Cuota = () => {

  const [periodo,setPeriodo]=useState('');
  const { getDataEmpleadosxPeri,getSNR,loading }=useFirestore();
  const { dataEmpleado }=useUserContext();
  const [copiedDataEmpleado, setCopiedDataEmpleado] = useState([]);
  const [remuneraciones, setRemuneraciones] = useState({});
  const [cuotaSindicales, setCuotaSindicales] = useState({});
  const [snrData, setSnrData] = useState([]);
  const [totales, setTotales] = useState({
    remuneraciones: 0,
    cuotasSindicales: 0,
    totalSNRData: 0,
  });


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
      }else{
        try{
          await getDataEmpleadosxPeri(values.periodo);
          setPeriodo(values.periodo);
        }catch(error){
          console.error("Error al obtener empleados por periodo", error);
        }finally{
          setSubmitting(false);
        }
      }

    }

    const validationSchema = Yup.object().shape({
      periodo: Yup.string().matches(/^(0[1-9]|1[0-2])(1[9-9]|20)\d{2}$/, 'El formato debe ser mmaa válido'),
    });

    const calcularAporte = (remuneracion) => {
      return remuneracion * 0.02;
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

    const formatDate = (timestamp) => {
      if (!timestamp) {
        return ''; // Manejar el caso de fecha nula si es necesario
      }
      if (timestamp.toDate) {
        const dateObject = timestamp.toDate(); // Convertir el timestamp a un objeto Date
        const day = dateObject.getDate();
        const month = dateObject.getMonth() + 1; // Nota: los meses en JavaScript son de 0 a 11
        const year = dateObject.getFullYear();
        return `${day}/${month}/${year}`;

      }  
    };

    const formatCurrency = (amount) => {
      return amount.toFixed(2);
    };

    const handleRemuneracionBlur = (cuil) => {
      const cuota = remuneraciones[cuil] * 0.02;
      setCuotaSindicales((prevCuotas)=>({
        ...prevCuotas,
        [cuil]: cuota,
      }));
    }
    
    const handleRemuneracionChange = (e,cuil) => {
      console.log('entre')
      const inputValue = e.target.value === '' ? null : Number(e.target.value);
      setRemuneraciones((prevRemuneraciones)=>({
        ...prevRemuneraciones,
        [cuil]: inputValue,
      }));
      
      // const cuota = inputValue !== null ? inputValue * 0.02 : 0;
      // setCuotaSindicales((prevCuotas)=>({
      //   ...prevCuotas,
      //   [cuil]: cuota,
      // }));
    };
    
    
    useEffect(()=>{
      if(periodo && dataEmpleado){
        const newDataEmpleado = dataEmpleado.map((item) => ({
          ...item,
          remuneracion: 0,
          sumasnr: 0,
        }));
        setCopiedDataEmpleado(newDataEmpleado);  
      }

    },[periodo]);

    useEffect(() => {

      const fetchData = async () => {
        const snrPromises = copiedDataEmpleado.map((item) => getSNR(periodo, item.categoria));
        const snrResults = await Promise.all(snrPromises);
        setSnrData(snrResults);
      };

      fetchData();

    }, [copiedDataEmpleado]);
  
    useEffect(()=>{
      let remuneracionesTotal = 0;
      let cuotasSindicalesTotal = 0;
      let snrDataTotal = 0;

      copiedDataEmpleado.forEach((item, index) => {
        remuneracionesTotal += remuneraciones[item.cuil] || 0;
        cuotasSindicalesTotal += cuotaSindicales[item.cuil] || 0;
        snrDataTotal += snrData[index] || 0;
      });

      setTotales({
        remuneraciones: remuneracionesTotal,
        cuotasSindicales: cuotasSindicalesTotal,
        totalSNRData: snrDataTotal,
      });
    },[remuneraciones])

    return (

    <Box sx={{mt: 4, maxWidth: "1000px", mx: "auto", textAlign: "center"}}>
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

                {
                  periodo && (
                    <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>CUIL</TableCell>
                          <TableCell>Apellido</TableCell>
                          <TableCell>Nombres</TableCell>
                          <TableCell>Categoría</TableCell>
                          <TableCell>Fecha de Ingreso</TableCell>
                          <TableCell>Fecha de Egreso</TableCell>
                          <TableCell>Remuneración</TableCell>
                          <TableCell>Cuota Sindical 2%</TableCell>
                          <TableCell>S.N.R.</TableCell>
                          <TableCell>Aporte 2% S.N.R.</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {copiedDataEmpleado.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.cuil}</TableCell>
                            <TableCell>{item.apellido}</TableCell>
                            <TableCell>{item.nombres}</TableCell>
                            <TableCell>{categorias[item.categoria]}</TableCell>
                            <TableCell align="center">{formatDate(item.fecha_ingreso)}</TableCell>
                            <TableCell align="center">{formatDate(item.fecha_egreso)}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={remuneraciones[item.cuil] === undefined ? '' : remuneraciones[item.cuil]}
                                onChange={(e)=>handleRemuneracionChange(e,item.cuil)}
                                onBlur={()=>handleRemuneracionBlur(item.cuil)}
                              />
                            </TableCell>
                            {/* <TableCell>{cuotaSindicales[item.cuil]}</TableCell>
                            <TableCell>{snrData[index]}</TableCell>
                            <TableCell>{snrData[index] * 0.02}</TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableRow>
                        <TableCell colSpan={5} align="right">Totales:</TableCell>
                        <TableCell>{formatCurrency(totales.remuneraciones)}</TableCell>
                        <TableCell>{formatCurrency(totales.cuotasSindicales)}</TableCell>
                        <TableCell>{formatCurrency(totales.totalSNRData)}</TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>                    
                  )
                }

              </Box>
            )}           
         </Formik>
    </Box>     
    )
}

export default Cuota
