import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { UserContext } from '../context/userProvider'

const Navbar = () => {

  const {user,setUser}=useContext(UserContext);

  return (
    <div>
      {user ? (
        <>
        <NavLink to="/">Home | </NavLink>
        <button onClick={()=>setUser(false)}>Logout</button>
        </>
      ) : (
        <NavLink to='/login'>Login</NavLink>
      )}

    </div>
  )
}

export default Navbar