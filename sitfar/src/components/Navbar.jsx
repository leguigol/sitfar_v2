import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { UserContext } from '../context/userProvider'

const Navbar = () => {

  const {user,signOutUser}=useContext(UserContext);

  const handleLogOut=async()=>{
    try{
      await signOutUser();
    }catch(error){
      console.log(error);
    }
  }
  return (
    <div>
      {user ? (
        <>
        <NavLink to="/">Home | </NavLink>
        <button onClick={handleLogOut}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to='/login'>Login |</NavLink>
          <NavLink to='/register'>Registrarse |</NavLink>

        </>
      )}

    </div>
  )
}

export default Navbar