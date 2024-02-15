import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

const useRedirectActiveUser = (user,path) => {

    const navigate=useNavigate();

    useEffect(()=>{
        if(user){
            navigate(path);
        }
    },[user]);
};

export default useRedirectActiveUser
