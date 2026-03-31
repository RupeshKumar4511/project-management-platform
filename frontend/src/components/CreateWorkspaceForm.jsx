import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import {  useCreateWorkspaceMutation } from "../features/workspaceSlice";
import LoadingSpinner from "./LoadingSpinner";
import SuccessModal from "./SuccessModal";


export default function CreateWorkspaceForm() {

  const formRef = useRef(null);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [createWorkspace, { isLoading, isSuccess,  error }] = useCreateWorkspaceMutation();


  const onSubmit = (data) => {
    createWorkspace(data)
  };

  const handleClick = () => {
    reset({
      workspaceName: '',
      description: '',
    });
    
    setTimeout(()=>{
      navigate('/app');
    })
  }

    if (isSuccess) {
        return (
            <SuccessModal handleClick={handleClick} message={"Your Workspace is created successfully.."} />
        )
    }



  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-semibold text-gray-800">
        Create Your Workspace
      </h2>
      {isLoading && <LoadingSpinner /> }
      <p className="text-gray-500 mt-2">
        Set up a new organizational space for your team and start managing
        projects instantly.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid grid-cols-1 gap-4"
        ref={formRef}
      >
       <p className={`text-red-500 ${error?.data ? '' : 'hidden'}`}>{error?.data ? error?.data?.message : ''}</p>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Workspace Name</label>
          <input
            type="text"
            name="workspaceName"
            placeholder="e.g. My Company"
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            {...register("workspaceName", {
              required: "workspaceName is required",
              maxLength: {
                value: 20, message: "Length of workspaceName cannot exceeds 20 characters."
              }
            })}
          />
          <span className="text-red-500 md:text-sm text-[12px] ">{errors.workspaceName?.message}</span>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            rows={3}
            name="description"
            placeholder="Short description about your organization"
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            {...register("description", {
              required: "description is required",
              maxLength: {
                value: 255, message: "Length of description cannot exceeds 255 characters."
              }
            })}
          />
          <span className="text-red-500 md:text-sm text-[12px] ">{errors.description?.message}</span>
        </div>

        <button
          type="submit"
          className="md:col-span-2 w-full mt-2 rounded-xl bg-indigo-600 text-white py-3 font-medium hover:bg-indigo-700 transition"
        >
          Create Workspace
        </button>
      </form>
    </div>
  );
}
