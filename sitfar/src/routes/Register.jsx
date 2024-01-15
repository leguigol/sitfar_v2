import React, { useContext, useState } from 'react'
import { UserContext } from '../context/userProvider';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [email,setEmail]=useState('leguigol@gmail.com');
    const [password,setPassword]=useState('lancelot')

    const {registerUser}=useContext(UserContext);
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log('Procesando form',email,password);
        try{    
            await registerUser(email,password);
            navigate("/");
        }catch(error){
            console.log('error:',error.code);
        }
    }
  return (
    <>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder='Ingrese Email' value={email} onChange={e=>setEmail(e.target.value)}/>
            <input type="password" placeholder='Ingrese password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button type="submit">Register</button>
        </form>
    </>
  )
}

export default Register
