import { useNavigate } from "react-router-dom";
import api from "../api/api";


export default function Boards() {

    const navigate = useNavigate();

    const getFullBoard = async () => {
        const resp = await api.get('/boards/21b3df1e-757b-4bda-8a47-785fc9aca22a/full')
        console.log(resp)
    }

    const signOut = () => {
        navigate('/register')
    }

    return (
      <div>
        <h1>Boards</h1>
        
        <button onClick={signOut}>Sign out</button>
        <button onClick={getFullBoard}>Get full board</button>
      </div>
    );
  }