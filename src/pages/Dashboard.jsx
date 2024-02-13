import { useEffect, useState } from "react";
import { logout } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";


const Dashboard = () => {

    const { dataFarmacia }=useUserContext();
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


    return (
        <>
            <h2>Bienvenido: {dataFarmacia.razon}</h2> 
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default Dashboard;
