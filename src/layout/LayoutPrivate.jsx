// import { Outlet, useNavigate } from "react-router-dom";
import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const LayoutPrivate = () => {
    
    const {user}=useUserContext();
    // const navigate=useNavigate();

    // useEffect(()=>{
    //     console.log(user);
    //     if(!user){
    //         navigate('/')
    //     }
    // },[user])

    return <>
    {
            user ? <Outlet /> : <Navigate to="/" />
    }
    </>
}     
 

export default LayoutPrivate;
