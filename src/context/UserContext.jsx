import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

export const UserContext=createContext();

const UserProvider=({children})=>{

    const savedDataFarmacia=JSON.parse(localStorage.getItem("dataFarmacia")) || [];
    const savedDataEmpleado=JSON.parse(localStorage.getItem("dataEmpleado")) || [];

    const [dataFarmacia,setDataFarmacia]=useState(savedDataFarmacia);
    const [dataEmpleado,setDataEmpleado]=useState(savedDataEmpleado);

    const [user,setUser]=useState(false);
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        const unsuscribe=onAuthStateChanged(auth,(user)=>{
            //console.log(user);
            setUser(user);
        })
        return unsuscribe;
    },[]);

    useEffect(()=>{
        localStorage.setItem("dataFarmacia",JSON.stringify(dataFarmacia));
    }, [dataFarmacia]);

    useEffect(()=>{
        localStorage.setItem("dataEmpleado",JSON.stringify(dataEmpleado));
    }, [dataEmpleado]);

    if(user===false) return <p>Loading app....</p>

    return (
        <UserContext.Provider value={{user,setUser,loading,setLoading,dataFarmacia,setDataFarmacia,dataEmpleado,setDataEmpleado}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;

export const useUserContext=()=> useContext(UserContext)