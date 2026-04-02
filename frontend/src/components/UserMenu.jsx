import { useRef, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../features/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function UserMenu({ isOpen, setIsOpen }) {

    const menuRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // Close popup if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { authResponse } = useSelector((store) => store.auth);
    const handleSignOut = () => {
        dispatch(signOut({ username: authResponse.username }))

    }

    useEffect(() => {
        if (authResponse.logout) {
            navigate('/');
        }
    }, [authResponse, navigate])

    function getUserName(user) {
        const username = user.charAt(0).toUpperCase() + user.slice(1);
        return username;
    }


    

    return (
        <div className="relative inline-block" ref={menuRef}>
            {/* User Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none transition-transform active:scale-95"
            >
                <CgProfile className="size-7 rounded-full cursor-pointer bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400" />
            </button>

            {/* Popup Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-zinc-400">Signed in as</p>
                        <Link to="/app/profile" className="text-sm font-medium text-gray-900 dark:text-white truncate">{getUserName(authResponse?.username || "User")}</Link>
                    </div>

                    <div className="py-1">
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
