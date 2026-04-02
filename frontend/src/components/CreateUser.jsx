import { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authActions, signUp } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import ErrorPage from './ErrorPage';
import SuccessModal from './SuccessModal';
import LoadingSpinner from './LoadingSpinner';

export default function CreateUser() {
    const [time] = useState(Math.floor(Date.now() / 1000));
    const [timeLeft, setTimeLeft] = useState('5:00');
    const dispatch = useDispatch()
    const { state } = useLocation();
    const navigate = useNavigate()
    const formRef = useRef(null);
    const { response, isLoading, error } = useSelector(store => store.auth);
    const { register, handleSubmit, formState: { errors } } = useForm()


    useEffect(() => {
        const timerID = setInterval(() => {
            const now = Math.floor(Date.now() / 1000)
            const diff = now - time;
            if (diff >= 300) {
                setTimeLeft('0');
                clearInterval(timerID)
            } else {
                let remaining = 300 - diff;
                let minute = Math.floor(remaining / 60);
                let seconds = Math.floor(remaining % 60);
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                setTimeLeft(minute + ":" + seconds);

            }
        }, 1000)
        return () => clearInterval(timerID)

    }, [time])

    const onSubmit = (data) => {
        dispatch(signUp({ otp: data.otp, ...state }))
    }

    const handleClick = (setOpen) => {
        setOpen(false);
        dispatch(authActions.updateSignUpResponse());
        setTimeout(() => {
            navigate('/');
        }, 0);
    }

    if (response.success === true) {
        return (<SuccessModal handleClick={handleClick} message={"Success! Please log in."} />
        )
    }

    if (response.success === false) {
        return (
            <h1 className='text-center'>{response.message}</h1>
        )
    }

    if (error.signUpError) {
        return (
            <ErrorPage />
        )
    }




    return (
        <form
            method="POST"
            className="py-8 px-8 flex flex-col bg-white overflow-hidden w-[90%] md:max-w-120 lg:max-w-150 mx-auto border-white rounded-md my-5 shadow-md"
            ref={formRef}

            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="mb-4 flex flex-col justify-between relative">
                <label htmlFor="title" className="text-sm md:text-lg mb-1 md:mb-0 md:mr-2">
                    Enter the OTP sent to your email : {state.email}
                </label>
                <input
                    type="text"
                    id="otp"
                    placeholder="Enter the OTP"
                    name="otp"
                    {...register("otp", {
                        required: "otp is required",
                        maxLength: {
                            value: 6, message: "Length of otp cannot exceeds 6 characters."
                        }
                    })}
                    className="flex-1 shadow-xs border border-black/10 focus:outline-blue-400 pl-2 py-1 rounded-md w-full "
                />
                <p className='text-fuchsia-600 md:text-sm text-[12px] py-1'>{timeLeft !== '0' ? `OTP will be expired in ${timeLeft} minute.` : "OTP expired"}</p>
                <span className="text-red-500 md:text-sm text-[12px] absolute top-20  right-0">{errors.otp?.message}</span>
            </div>

            {isLoading && <LoadingSpinner />}
            <button
                type="submit"
                className="shadow-md bg-blue-600 px-4 py-2 rounded-md text-white mt-4 hover:bg-blue-700 transition-colors"
            >
                Verify Email
            </button>
            <Link
                to='/'
                className=" px-4 py-2  text-blue-600 mt-4 "
            >
                Back to Home
            </Link>


        </form>

    )
}

