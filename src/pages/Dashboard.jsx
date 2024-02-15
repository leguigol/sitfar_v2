import { useEffect, useState } from "react";
import { logout } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";


const Dashboard = () => {

    const { dataFarmacia,setUser }=useUserContext();
    const { dataFar,getDataFarmacia,loading,error   }=useFirestore();

    const navigate = useNavigate();

    useEffect(()=>{
        getDataFarmacia();
        console.log('dataFarmacia:',dataFarmacia);
    },[]);
    
    if (loading.getData) return <p>Loading data....</p>
    // if (error) return <p>{error}</p>

    const handleLogout=async()=>{
        try{
            await logout();
        }catch(error){
            console.log(error);
        }
    }

    return (
        <>
            <h2>Bienvenido: {dataFarmacia.razon}</h2> 
            <button onClick={handleLogout}>Logout</button>        
        </>
    )
}

export default Dashboard;
