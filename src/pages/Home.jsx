import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import Login from "./Login";

const Home = () => {

    const {setUser}=useUserContext()
    const navigate=useNavigate();

    const handleLogin=()=>{
        navigate('/login');
    }
  return (
    <>
      <h1>home</h1>
      <button onClick={handleLogin}>Login</button>  
    </>
  )
}

export default Home;
