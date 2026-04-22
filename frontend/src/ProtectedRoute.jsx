import {useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { authResponse } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const userData = useLoaderData();

    useEffect(() => {
        
        if (!userData?.success && !authResponse.success) {
            navigate('/');
        }
    }, [authResponse, navigate]);


    return children;
};


export default ProtectedRoute;
