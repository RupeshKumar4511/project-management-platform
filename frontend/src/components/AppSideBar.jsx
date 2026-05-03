import { NavLink, useNavigate } from 'react-router-dom';
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../features/authSlice';
import ErrorPage from './ErrorPage'
import ensureAuth from '../features/ensureAuth';


export default function AppSideBar({ open, setOpen }) {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [menu, setMenu] = useState(false);
    const [URL, setURL] = useState('payment')

    const { authResponse, error } = useSelector((store) => store.auth);
    const handleSignOut = () => {
        dispatch(signOut({ username: authResponse.username }))

    }

    useEffect(() => {
        const fetchUserPlan = async () => {
            try {
                await ensureAuth();
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/details`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.payment) {
                    setURL('create-workspace');
                }
            } catch (error) {
                
                console.error("Fetch failed:", error);
            }
        };

        fetchUserPlan();
    }, []);

    useEffect(() => {
        if (authResponse.logout) {
            navigate('/');
        }
    }, [authResponse, navigate])

    function getUserName(user) {
        const username = user.charAt(0).toUpperCase() + user.slice(1);
        return username;
    }


    if (error.logoutError) {
        return <ErrorPage />
    }

    if (authResponse.username) {
        return (

            <div className={`max-w-max bg-slate-200 flex-col 
            md:px-6 lg:px-14 px-5 py-4 md:flex fixed top-10 left-0 z-10 md:top-16
            bottom-0 ${open ? 'flex' : 'hidden'}`}>
                <NavLink to="/app" className="py-1 lg:text-xl" onClick={() => setOpen(!open)}>Home</NavLink>
                <NavLink to={`/app/${URL}`} className="py-1 lg:text-xl" onClick={() => setOpen(!open)}>Workspace</NavLink>
                <div className="py-1 flex lg:text-xl" onClick={() => setMenu((prevState) => !prevState)}>{getUserName(authResponse?.username || "User")}<IoIosArrowDropdownCircle className='relative top-2' size={15} /></div>
                <ul className={`px-2 ${menu ? '' : 'hidden'} md:text-md text-sm`}>
                    <li><NavLink to="/app/profile" onClick={() => setOpen(!open)}>Profile</NavLink></li>
                    <li className='cursor-pointer' onClick={() => {
                        handleSignOut()
                    }}>Sign out</li>
                </ul>
            </div>

        );
    }

}