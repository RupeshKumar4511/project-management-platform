import {useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { authResponse } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!authResponse.success) { navigate('/')} 
    },[authResponse, navigate])

    return (
        children
    )

}

export default ProtectedRoute;
