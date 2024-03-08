import { Avatar, FormHelperText, FormControl, MenuItem, Select, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Input,Checkbox } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import CalculateIcon from '@mui/icons-material/Calculate';
import { Formik } from 'formik';
import * as Yup from "yup";
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
import { useFirestore } from '../hooks/useFirestore';
import { useUserContext } from '../context/UserContext';
import InputLabel from '@mui/material/InputLabel';

const Cuota = () => {

  const [periodo,setPeriodo]=useState('');
  const { getDataEmpleadosxPeri,getSNR,loading,addCuotaCab,incrementarContadorBoleta}=useFirestore();
  const { dataEmpleado }=useUserContext();
  const [copiedDataEmpleado, setCopiedDataEmpleado] = useState([]);
  const [remuneraciones, setRemuneraciones] = useState([]);
  const [cuotaSindicales, setCuotaSindicales] = useState({});
  const [snrData, setSnrData] = useState([]);
  const [imprimirBoletaHabilitado, setImprimirBoletaHabilitado] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState([]);
  const [medioPago, setMedioPago]=useState('TR');

  const [totales, setTotales] = useState({
    remuneraciones: 0,
    cuotasSindicales: 0,
    totalSNRData: 0,
  });


  const onSubmit=async(values,{setSubmitting, errors,touched,setErrors})=>{
      //console.log('values', values);
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
          if(dataEmpleado.length>0){
            const newDataEmpleado = dataEmpleado.map((item) => ({
             ...item,
             remuneracion: 0,
             sumasnr: 0,
            }));
            setCopiedDataEmpleado(newDataEmpleado);  
          }

          // tota();
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

    // const formatCurrency = (amount) => {
    //   return amount.toFixed(2);
    // };

    const handleRemuneracionBlur = (cuil) => {
      const cuota = remuneraciones[cuil] * 0.02;
      setCuotaSindicales((prevCuotas)=>({
        ...prevCuotas,
        [cuil]: cuota,
      }));

    }
    
    const handleRemuneracionChange = (e,cuil) => {

      const inputValue = e.target.value === '' ? null : parseFloat(e.target.value);
      setRemuneraciones((prevRemuneraciones)=>({
        ...prevRemuneraciones,
        [cuil]: inputValue,
      }));
      
      const cuota = inputValue !== null && inputValue >= 0 ? inputValue * 0.02 : 0;
      setCuotaSindicales((prevCuotas)=>({
        ...prevCuotas,
        [cuil]: cuota,
      }));

    };
    
    const tota=()=>{
      let remuneracionesTotal = 0;
      let cuotasSindicalesTotal = 0;
      let snrDataTotal = 0;

      copiedDataEmpleado.forEach((item, index) => {
        remuneracionesTotal += remuneraciones[item.cuil] || 0;
        cuotasSindicalesTotal += cuotaSindicales[item.cuil] || 0;
        snrDataTotal += item.sumasnr || 0;
        console.log(snrDataTotal);
      });

      setTotales({
        remuneraciones: remuneracionesTotal,
        cuotasSindicales: cuotasSindicalesTotal,
        totalSNRData: snrDataTotal,
      });

    }
    
    
    useEffect(() => {

      const fetchData = async () => {
        const snrPromises = copiedDataEmpleado.map((item) => getSNR(periodo, item.categoria));
        const snrResults = await Promise.all(snrPromises);
        setSnrData(snrResults);
        console.log('snrdata:',snrData);
        
      };

      fetchData();

    }, [periodo]);

    useEffect(()=>{
      if (snrData[0]===0) {
        Swal.fire({
          title: "¡Atención!",
          text: "No se encontraron datos de S.N.R. para el período seleccionado.",
          icon: "warning",
          confirmButtonText: "Comuniquese con el administrador del sistema",
        });
      }  

      const newDataEmpleado = dataEmpleado.map((item,index) => ({
        ...item,
        remuneracion: 0,
        sumasnr: item.licencia ? 0 : parseFloat(snrData[index]*0.02),
      }));
      
      setCopiedDataEmpleado(newDataEmpleado);  
      console.log('useEffect de periodo:',newDataEmpleado);
      tota();

    },[snrData]);
  
    useEffect(() => {
      const habilitado = validarDatos();

      setImprimirBoletaHabilitado(habilitado);
      tota();
    }, [remuneraciones,copiedDataEmpleado]);

    const validarDatos = () => {
      const errores = [];
      let totsnr=0;

      copiedDataEmpleado.forEach((item, index) => {
        console.log('float:',item);
        if ((parseFloat(remuneraciones[item.cuil]) <= 0 || remuneraciones[item.cuil]===undefined || remuneraciones[item.cuil]===null) && item.sindical &&!item.licencia) {
          errores.push({
            campo: "remuneracion",
            cuil: item.cuil,
            mensaje: "Remuneración no puede ser cero o negativa si es Sindical",
          });
        }

        // Validación para checkbox Licencia y Remuneración/S.N.R.
        if (item.licencia) {
          if (remuneraciones[item.cuil] !== 0) {
            errores.push({
              campo: "remuneracion",
              cuil: item.cuil,
              mensaje: "Remuneración debe ser cero si Licencia está marcado",
            });
          }
          if (item.sumasnr !== 0) {
            errores.push({
              campo: "snrData",
              cuil: item.cuil,
              mensaje: "S.N.R. debe ser cero si Licencia está marcado",
            });
          }
        }
        totsnr+=snrData[index];

      });

      setErroresValidacion(errores);
      console.log('errores validacion',erroresValidacion)
      return errores.length === 0;
    };

    const handleChange2 = (event) => {
      setMedioPago(event.target.value);
    };

    const generarBoleta = async () => {
      try {

        console.log('generarBoleta',totales.remuneraciones);
        // Lógica para grabar en cuota_cab
        const contador=incrementarContadorBoleta();

        console.log('boleta nro: ',contador);
    
        // Lógica para grabar en cuota_det
        // ...
    
        // Resto de la lógica de generación de boletas
      } catch (error) {
        console.error("Error al generar la boleta", error);
        // Manejar el error, mostrar un mensaje, etc.
      }
    };

    return (
    
    <Box sx={{mt: 4, maxWidth: "1400px", mx: "auto", textAlign: "center", overflow: "scroll"}}>
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
                  periodo &&  (
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
                          <TableCell>Lic.</TableCell>
                          <TableCell>Red.</TableCell>
                          <TableCell>Sind.</TableCell>
                          <TableCell>Remuneración</TableCell>
                          <TableCell>Cuota Sindical 2%</TableCell>
                          <TableCell>S.N.R.</TableCell>
                          <TableCell>Aporte 2% S.N.R.</TableCell>
                        </TableRow>
                      </TableHead>
                      { copiedDataEmpleado.map((item, index) => (
                      <TableBody key={index}>
                          <TableRow>
                            <TableCell>{item.cuil}</TableCell>
                            <TableCell>{item.apellido}</TableCell>
                            <TableCell>{item.nombres}</TableCell>
                            <TableCell>{categorias[item.categoria]}</TableCell>
                            <TableCell align="center">{formatDate(item.fecha_ingreso)}</TableCell>
                            <TableCell align="center">{formatDate(item.fecha_egreso)}</TableCell>
                            <TableCell align="center">
                              <Checkbox checked={item.licencia} />
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox checked={item.reducida} />
                            </TableCell>
                            <TableCell align="center">
                              <Checkbox checked={item.sindical} />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={remuneraciones[item.cuil] === undefined ? '' : remuneraciones[item.cuil]}
                                onChange={(e)=>handleRemuneracionChange(e,item.cuil)}
                                onBlur={()=>handleRemuneracionBlur(item.cuil)}
                              />

                              {erroresValidacion.find(error => error.campo === "remuneracion" && error.cuil === item.cuil) && (
                               <FormHelperText error>{erroresValidacion.find(error => error.campo === "remuneracion" && error.cuil === item.cuil).mensaje}</FormHelperText>
                              )}
                            </TableCell>

                            <TableCell>{cuotaSindicales[item.cuil] ? (cuotaSindicales[item.cuil]).toFixed(2): 0}</TableCell>
                            <TableCell>{snrData[index]}</TableCell>
                            <TableCell>{(item.sumasnr).toFixed(2)}</TableCell>
                          </TableRow>
                          
                      </TableBody>
                        ))}
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={2}>Total Remuneraciones: $</TableCell>
                          <TableCell>{(totales.remuneraciones.toFixed(2))}</TableCell>
                          <TableCell></TableCell>
                          <TableCell colSpan={2}>Total Cuota Sindical $</TableCell>
                          <TableCell>{(totales.cuotasSindicales.toFixed(2))}</TableCell>
                          <TableCell></TableCell>
                          <TableCell colSpan={2}>Total S.N.R. </TableCell>
                          <TableCell>{(totales.totalSNRData).toFixed(2)}</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Total a Pagar: $</TableCell>
                          <TableCell>{(totales.cuotasSindicales+totales.totalSNRData).toFixed(2)}</TableCell>
                          <TableCell>
                          <FormControl sx={{ m: 1, minWidth: 300 }}>
                            <InputLabel id="medio">MEDIO/PAGO</InputLabel>
                           <Select
                                labelId="medio"
                                id="demo-simple-select-autowidth"
                                value={medioPago}
                                onChange={handleChange2}
                                label="mediodepago"
                              >
                                <MenuItem value={'TR'}>TRANSFERENCIA</MenuItem>
                                <MenuItem value={'MP'}>MERCADO PAGO</MenuItem>
                            </Select>
                          </FormControl>        
                          </TableCell>
                        </TableRow>
                      </TableHead>

                    </Table>
                  </TableContainer>                    
                  )
                }
                <LoadingButton
                  type="submit"
                  disabled={!imprimirBoletaHabilitado || totales.totalSNRData===0}
                  loading={isSubmitting}
                  variant='contained'
                  fullWidth
                  onClick={generarBoleta}
                  sx={{ mb: 1 }}
                >GENERAR E IMPRIMIR BOLETA</LoadingButton>  

              </Box>
            )}           
         </Formik>
    </Box>     
    )
}

export default Cuota
