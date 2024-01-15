import React, { useContext } from 'react'
import { UserContext } from '../context/userProvider'
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const {user,setUser}=useContext(UserContext);
  
  const navigate=useNavigate();

  const handleClickLogin=()=>{
    setUser(true);
    navigate("/");
  }
  
  return (
    <>
        <div>Login</div>
        <h2>
            {
                user ? 'En linea' : 'Off line'
            }
        </h2>    
        <button onClick={handleClickLogin}>Acceder</button>
    </>
  )
}

export default Login