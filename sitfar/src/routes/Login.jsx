import React, { useContext, useState } from 'react'
import { UserContext } from '../context/userProvider'
import { useNavigate, useNavigation } from 'react-router-dom';

const Login = () => {

  const {loginUser}=useContext(UserContext);
  const [email,setEmail]=useState('leguigol@gmail.com');
  const [password,setPassword]=useState('lancelot')

  const navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      await loginUser(email,password);
      console.log('usuario logueado');
      navigate('/');    
    }catch(error){
      console.log('error de login');
    }
  }  
  return (
    <>
        <div>Login</div>
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder='Ingrese Email' value={email} onChange={e=>setEmail(e.target.value)}/>
            <input type="password" placeholder='Ingrese password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    </>
  )
}

export default Login