import { useEffect, useState } from "react";
import { logout } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";


const Dashboard = () => {

    const { user,dataFarmacia,setDataFarmacia}=useUserContext();
    const [farmacia,setFarmacia]=useState([]);
    const { getDataFarmacia}=useFirestore();

    const navigate = useNavigate();

    useEffect(()=>{
        getDataFarmacia();
        console.log('dataFarmacia:',dataFarmacia);
    },[]);
    

    const handleLogout=async()=>{
        try{
            await logout();
        }catch(error){
            console.log(error);
        }
    }

    // useEffect(() => {
    //     const fetchFarmacias = async () => {
    //       if (user && user.uid) {
    //         try {
    //           const farmaciasCollection = collection(db,'farmacias');
    //           const q=query(farmaciasCollection, where("id","==",user.uid));
    //           const docs = await getDocs(q);
              
    //           const res=[];

    //           docs.forEach(farmas=>{
    //             res.push({
    //                 id:farmas.uid,
    //                 ...farmas.data()    
    //             })
    //           })
    //           if (res.length > 0) {
    //             console.log(res)
    //             setDataFarmacia({"cuit:":res[0].cuit});
    //         } else {
    //             console.log("No se encontraron documentos.");
    //             navigate('/registro-farmacia')
    //         }
    //         } catch (error) {
    //           console.error('Error al obtener la colección de farmacias:', error);
    //         }
    //       }
    //     };
      
    //     fetchFarmacias();
    // }, [user]);

    return (
        <>
            <h2>Bienvenido: {dataFarmacia.razon}</h2> 
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default Dashboard;
