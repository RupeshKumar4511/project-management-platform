import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { authActions } from './features/authSlice';

const ProtectedRoute = ({ children }) => {
    const { authResponse } = useSelector((store) => store.auth);
    const userData = useLoaderData();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        
        if (userData?.success && !authResponse.success) {
            dispatch(authActions.setAuth(userData)); 
        }

        if (userData?.logout || (!userData?.success && !authResponse.success)) {
            navigate('/');
        }
    }, [userData, authResponse, navigate, dispatch]);

    
    if (!userData?.success) {
        return null; 
    }

    return children;
};


export default ProtectedRoute;
