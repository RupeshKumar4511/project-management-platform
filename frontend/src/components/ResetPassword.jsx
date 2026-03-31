import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { resetPassword } from '../features/authSlice';
import { authActions } from "../features/authSlice";
import LoadingSpinner from "./LoadingSpinner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const { resetPasswordResponse, isLoading, error } = useSelector(store => store.auth);

  const { handleSubmit, register, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    dispatch(resetPassword({ ...state, ...data }))
    dispatch(authActions.updateVerifyUserResponse());
  }



  useEffect(() => {
    if (resetPasswordResponse.success === true) {
      dispatch(authActions.updateSendMail2Response());
      dispatch(authActions.updateResetPasswordResponse())

      setTimeout(() => {
        alert("Password reset successfully");
        navigate("/");

      }, 1000)
    }

  }, [resetPasswordResponse, navigate])




  if (resetPasswordResponse.success === false) {
    return (
      <h1>{resetPasswordResponse.message}</h1>
    )
  }

  if (error.resetPasswordError) {
    return (
      <ErrorPage />
    )
  }
  return (

    <form className="vh-100 w-80 mx-auto border my-5 px-5 py-5 border-black/40 rounded-md shadow-md" ref={formRef} method="POST" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-xl font-bold text-blue-800">Reset Password</p>
      <div className="my-4 border-y border-gray-300 px-6 py-6 flex flex-col gap-5 bg-white ">
        <p className={`text-red-500 ${resetPasswordResponse.success ? 'hidden' : ''}`}>{!resetPasswordResponse.success ? resetPasswordResponse.message : ''}</p>
        <p className={`text-red-500 ${error.resetPasswordError ? '' : 'hidden'}`}>{error.resetPasswordError ? error.resetPasswordError : ''}</p>

        <div className="flex flex-col gap-2 relative mb-3">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 ">
            Password
          </label>
          <input
            id="reset-password"
            placeholder="Set your password"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="password"
            {
            ...register('password', {
              required: "password is required",
              pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: "Password must contains uppercase and lowercase letter, digit and special character." },
              minLength: { value: 8, message: "Password must be atleast 8 characters long." }
            })
            }
          />
          <span className="text-red-500 md:text-sm text-[12px] absolute top-16 left-1 ">{errors.password?.message}</span>

        </div>
      </div>
      {isLoading && <LoadingSpinner />}

      <div className="flex justify-end gap-4">
        <button className="rounded-md bg-gray-300 px-6 py-2 font-semibold hover:bg-gray-400/80 active:bg-gray-400/60
        cursor-pointer" onClick={() => { navigate('/') }}>
          Cancel
        </button>
        <button className="rounded-md bg-blue-300 px-6 py-2 font-semibold hover:bg-blue-400/80 active:bg-blue-400/60 cursor-pointer" >
          Reset Password
        </button>
      </div>
    </form>
  )
}

export default ResetPassword;
