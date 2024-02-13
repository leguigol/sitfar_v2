import {useFirestore} from '../hooks/useFirestore';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment'
import Checkbox from '@mui/material/Checkbox';
import { useUserContext } from '../context/UserContext';
import { Box, Button } from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// function createData(id, cuil, apellido, nombres, categoria,feingreso,feegreso) {
//     return { id,cuil, apellido, nombres, categoria,feingreso,feegreso };
//   }

const Empleados = () => {

    const {loading,dataEmpleado}=useUserContext()
    const {getDataEmpleados,deleteEmpleado,getDataEmpleadoById}=useFirestore();

    const navigate=useNavigate();

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

    const handleClickDelete=(id)=>{
      console.log('click en delete',id);
      Swal.fire({
        title: "Esta seguro?",
        text: "No podra revertir esta accion!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrarlo !"
      }).then(async(result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Borrado!",
            text: "El empleado ha sido borrado",
            icon: "success"
          });
          await deleteEmpleado(id);
        }
      });
    }

    const handleUpdate=(id)=>{
      console.log('hiciste click en update',id)
      getDataEmpleadoById(id);
      console.log('los datos del empleado:',dataEmpleado);
      navigate('/edit-empleado');
    }

    useEffect(()=>{
        getDataEmpleados();
    },[]);

    
          return (
            <>
            <Box>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Id</TableCell>
                    <TableCell align="center">Cuil</TableCell>
                    <TableCell align="center">Apellido</TableCell>
                    <TableCell align="center">Nombres</TableCell>
                    <TableCell align="center">Categoria</TableCell>
                    <TableCell align="center">Fecha Ingreso</TableCell>
                    <TableCell align="center">Fecha Egreso</TableCell>
                    <TableCell align="center">Licencia</TableCell>
                    <TableCell align="center">Reducida</TableCell>
                    <TableCell align="center">Sindical</TableCell>
                    <TableCell align="center" colSpan={2} >ACCION</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  
                  {
                    dataEmpleado.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="center">{row.cuil}</TableCell>
                      <TableCell align="center">{row.apellido}</TableCell>
                      <TableCell align="center">{row.nombres}</TableCell>
                      <TableCell align="center">{categorias[row.categoria]}</TableCell>
                      {/* <TableCell align="center">{row.fecha_ingreso}</TableCell> */}
                      <TableCell align="center">{row.fecha_ingreso===null ? '': moment(row.fecha_ingreso).format('DD/MM/YY')}</TableCell>
                      <TableCell align="center">{row.fecha_egreso===null ? '': moment(row.fecha_egreso).format('DD/MM/YY')}</TableCell>
                      <TableCell align="center">{row.licencia ? <Checkbox checked /> : null}</TableCell>
                      <TableCell align="center">{row.reducida ? <Checkbox checked /> : null}</TableCell>
                      <TableCell align="center">{row.sindical ? <Checkbox checked /> : null}</TableCell>
                      <TableCell align='center' onClick={()=>handleClickDelete(row.id)}>
                          <Button type='button' variant='contained' color='error'>BORRAR</Button>
                      </TableCell>
                      <TableCell align='center' onClick={()=>handleUpdate(row.id)}>
                          <Button type='button' variant='contained' color='success'>EDIT</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
            <Button 
              component={Link}
              sx={{padding: 1, margin: 2}}
              variant='contained'
              to="/alta-empleado"
            >ALTA DE EMPLEADO</Button>  
            
            </>
          );
        
    

}
export default Empleados;