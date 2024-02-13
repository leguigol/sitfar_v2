import { NavLink } from "react-router-dom"
// import { useContext } from "react";
// import { UserContext } from "../context/userContext";

import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';


const Navbar = () => {

    const { user,setUser}=useUserContext();
    const navigate=useNavigate();

  return (
    // <>
    //     <nav>
    //         {/* <NavLink to="/">Login |</NavLink> */}
    //         {
    //             user && (
    //                 <>
    //                     <NavLink to="/dashboard" className="btn btn-outline-primary me-2">Dashboard</NavLink>                
    //                     <NavLink to="/dashboard">Empleados</NavLink>                
    //                 </>
    //             )
    //         }
    //     </nav>
    // </>
    <AppBar position="static" color="success">
    <Toolbar>
      {user && (
        <>
          <Button component={NavLink} to="/dashboard" color="inherit" className="me-2">
            Dashboard
          </Button>
          <Button component={NavLink} to="/empleados" color="inherit">
            Empleados
          </Button>
          <Button component={NavLink} to="/cuota" color="inherit">
            Cuota Sindical
          </Button>

        </>
      )}
    </Toolbar>
  </AppBar>
  )
}

export default Navbar;