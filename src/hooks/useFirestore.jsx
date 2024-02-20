import React, { useEffect, useState } from 'react'
import { db,auth } from '../config/firebase';
import { collection, getDocs, getDoc, query, where,doc,setDoc, Query, orderBy, limit, addDoc, Timestamp, serverTimestamp, deleteDoc,updateDoc } from 'firebase/firestore';
import { useUserContext } from '../context/UserContext';
import { nanoid } from 'nanoid'

import dayjs, { unix } from 'dayjs';
import { Navigate } from 'react-router-dom';

export const useFirestore = () => {

    const [dataFar,setDataFar]=useState([]);
    const [dataEmp,setDataEmp]=useState([]);
    const [error,setError]=useState();
    const [loading,setLoading]=useState({});
    const {dataFarmacia,setDataFarmacia,dataEmpleado,setDataEmpleado}=useUserContext();

    const categoryMappings = {
        'Cadete': 0,
        'Aprendiz/Ayudante': 1,
        'Personal auxiliar': 2,
        'Personal con asignacion': 3,
        'Ayudante en gestion': 4,
        'Personal en gestion': 5,
        'Farmaceutico Art.7 A': 6,
        'Farmaceutico Art.7 B': 7,
        'Farmaceutico Art.7 C': 8,
    };

    const getDataFarmacia=async()=>{
        console.log('auth:',auth.currentUser.uid);
        try{
            setLoading(prev=>({...prev, getData: true}));

            const docRef = doc(db, 'farmacias', auth.currentUser.uid);

            const docSnapshot = await getDoc(docRef);
            console.log('docSnapshot: ',docRef);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log('Document data:', data);
                setDataFarmacia(data);
            } else {
                console.log('No such document!');
            }

        }catch(error){
            console.log('error retriving farmacias',error);
            setError(error.message); 
        }finally{
            setLoading(prev=>({...prev, getData: false}));
        }
    }

    
    const getDataEmpleados=async()=>{
        try{
            setLoading(prev=>({...prev, getDataE: true}));
            const dataRef=collection(db,"empleados");
            const q=query(dataRef,where("cuit","==",dataFarmacia.cuit));
            const querySnapshot=await getDocs(q);
            const dataDB=querySnapshot.docs.map((doc) => doc.data());
            console.log('data db empleados:',dataDB);
            setDataEmp(dataDB);
        }catch(error){
            console.log('error retriving farmacias',error);
            setError(error.message); 
        }finally{
            setLoading(prev=>({...prev, getDataE: false}));
        }
    }

    const getDataEmpleadoById = async (empleadoId) => {
      try {
        setLoading((prev) => ({ ...prev, getDataEById: true }));
        setDataEmpleado(null)
    
        const empleadoRef = doc(db, 'empleados', empleadoId);
        const empleadoDoc = await getDoc(empleadoRef);
        console.log("🚀 ~ getDataEmpleadoById ~ empleadoDoc:", empleadoDoc)
    
        if (empleadoDoc.exists()) {
          const empleadoData = {
            id: empleadoDoc.id,
            ...empleadoDoc.data(),
          };
          console.log('empleadoData:',empleadoData)
          setDataEmpleado(empleadoData);
        } else {
          console.log(`No existe un empleado con el ID ${empleadoId}`);
          setDataEmpleado(false);
        }
      } catch (error) {
        console.error('Error al recuperar empleado por ID:', error);
        setError(error.message);
      } finally {
        setLoading((prev) => ({ ...prev, getDataEById: false }));
      }
    };
    
    const getDataEmpleadosxPeri = async (periodo) => {
        console.log('periodo en xperi:',periodo)
        try {
          setLoading((prev) => ({ ...prev, getDataE: true }));
      
          const cuit = dataFarmacia.cuit;
          const dataRef = collection(db, "empleados");
            
        //   const primerDiaDelMes = new Date(`${periodo.slice(2)}-${periodo.slice(0, 2)}-01T00:00:00`);
        //   const ultimoDiaDelMesAnterior = new Date(primerDiaDelMes);
        //   ultimoDiaDelMesAnterior.setDate(ultimoDiaDelMesAnterior.getDate() - 1);

        const primerDiaDelMes = new Date(`20${periodo.slice(2)}-${periodo.slice(0, 2)}-01T00:00:00`);
        const ultimoDiaDelMesAnterior = new Date(primerDiaDelMes);
        ultimoDiaDelMesAnterior.setDate(0);
        
        console.log('primer dia: ',primerDiaDelMes);
          console.log('ultimo dia: ',ultimoDiaDelMesAnterior);

          const q = query(
            dataRef,
            where("cuit", "==", cuit),
            where("fecha_ingreso", "<=", primerDiaDelMes)
          );
      
          const querySnapshot = await getDocs(q);
          const dataDB = querySnapshot.docs.map((doc) => doc.data());
      
          console.log("data db empleados por periodo:", dataDB);
          setDataEmpleado(dataDB);
        } catch (error) {
          console.error("error retriving empleados por periodo", error);
          setError(error.message);
        } finally {
          setLoading((prev) => ({ ...prev, getDataE: false }));
        }
    };
      
    const getSNR = async (periodo, categoria) => {
        console.log('periodo: ',periodo, ' y categoria: ',categoria);
        try {
          const dataRef = collection(db, 'sumas_snr'); 
      
          const q = query(dataRef, where('periodo', '==', periodo), where('categoria', '==', categoria));
          
          const querySnapshot = await getDocs(q);
      
          if (querySnapshot.size > 0) {
            return querySnapshot.docs[0].data().snr;
          } else {
            console.log('No se encontraron documentos para el periodo y la categoría especificados');
            return null; 
          }
        } catch (error) {
          console.error('Error al obtener el documento:', error);
          throw error;
        }
    };
       
    const addDataF=async(formData)=>{
          
        try{
            setLoading(prev=>({...prev, addDataF: true}));
            const newDoc={
                cuit: formData.cuit,
                razon: formData.razon,
                domicilio: formData.domicilio,
                localidad: formData.localidad,
                telefono: formData.telefono,
                email: formData.email,
                id: auth.currentUser.uid
            }
            // console.log(formData);

            const docRef=doc(db,"farmacias",newDoc.id);
            await setDoc(docRef,newDoc);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(prev=>({...prev, addDataF: false}));
        }
    }

    const addDataE=async(formData)=>{
        console.log("formdata:",formData);
        console.log("tipo de fecha: ",typeof(formData.fechaingreso))
        try{
            setLoading(prev=>({...prev, addDataE: true}));
            
            const xcategoria = categoryMappings[formData.categoria];

            if (xcategoria === undefined) {
              // Manejar caso de categoría no mapeada
              throw new Error('Categoría no válida');
            }

            const fechaingreso=formData.fechaingreso+"T00:00:00";

            const newDoc={
                id: nanoid(6),
                cuit: dataFarmacia.cuit,
                cuil: formData.cuil,
                apellido: formData.apellido.toUpperCase(),
                nombres: formData.nombres.toUpperCase(),
                categoria: xcategoria,
                fecha_ingreso: new Date(fechaingreso),
                fecha_egreso: null,
                licencia: formData.licencia,
                reducida: formData.reducida,
                sindical: formData.sindical,
                Timestamp: serverTimestamp(),
            }

            const docRef = doc(db,"empleados",newDoc.id);
            await setDoc(docRef,newDoc);
        }catch(error){
            console.log(error);
        }finally{
            setLoading(prev=>({...prev, addDataE: false}));
        }
    }
    const deleteEmpleado=async(nanoid)=>{
        try{
            setLoading((prev)=>({...prev, deleteData: true}));
            const docRef=doc(db,"empleados",nanoid);
            await deleteDoc(docRef);
            setDataEmp(dataEmp.filter(item=>item.id !==nanoid));
        }catch(error){
            console.log('error al deletear');
        }finally{
            setLoading((prev)=>({...prev,deleteData: false}));
        }
    }

    function isValidDate(date) {
      // Verifica si date es una instancia de Date y si su valor de tiempo no es NaN
      return date instanceof Date && !isNaN(date.getTime());
    }

    const updateEmpleado=async(empleado,nanoid)=>{
        console.log('datos de empleado:',empleado,' nanoid:',nanoid)
        try{
            const xcategoria = categoryMappings[empleado.categoria];
            const fechaingreso=empleado.fechaingreso.toDate();
            console.log('valor de feegreso:',new Date(empleado.fechaegreso).getFullYear());
            let fechae=new Date(empleado.fechaegreso).getFullYear();
            let fechaegreso;
            if(fechae===1969){
              fechaegreso=null;
            }else
              fechaegreso=empleado.fechaegreso.toDate();
            console.log('fechaegreso:',fechaegreso);

            setLoading((prev)=> ({...prev, updateData: true}));
            const docRef=doc(db,"empleados",nanoid);
            await updateDoc(docRef, 
              {cuil: empleado.cuil,
               apellido: empleado.apellido.toUpperCase(),
               nombres: empleado.nombres.toUpperCase(),
               categoria: xcategoria,
               fecha_ingreso: fechaingreso,
               fecha_egreso: fechaegreso===null ? null: fechaegreso,
               licencia: empleado.licencia,
               reducida: empleado.reducida,
               sindical: empleado.sindical
              }
            );
        }catch(error){
            console.log("🚀 ~ updateEmpleado ~ error:", error)
            setError(error.message);
        }finally{
            setLoading((prev)=>({ ...prev, updateData: false}));
        }
    }
    return {
        dataFar,
        dataEmp,
        error,
        loading,
        getDataFarmacia,
        addDataF,addDataE,getDataEmpleados,
        deleteEmpleado,
        getDataEmpleadoById,
        updateEmpleado,
        getDataEmpleadosxPeri,
        getSNR
    }
    
}

