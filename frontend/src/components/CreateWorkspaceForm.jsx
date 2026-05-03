import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import { useCreateWorkspaceMutation } from "../features/workspaceSlice";
import LoadingSpinner from "./LoadingSpinner";
import SuccessModal from "./SuccessModal";

export default function CreateWorkspaceForm() {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [createWorkspace, { isLoading, isSuccess, error }] = useCreateWorkspaceMutation();

  const onSubmit = (data) => {
    createWorkspace(data)
  };

  const handleClick = () => {
    reset({ workspaceName: '', description: '' });
    setTimeout(() => { navigate('/app'); })
  }

  if (isSuccess) {
    return <SuccessModal handleClick={handleClick} message={"Your Workspace is created successfully.."} />
  }

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 sm:p-6 md:p-10 max-w-2xl mx-auto w-[95%] sm:w-[90%] md:w-full my-4 md:my-10">

      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
        Create Your Workspace
      </h2>

      {isLoading && <LoadingSpinner />}

      <p className="text-gray-500 mt-2 text-xs sm:text-sm md:text-base">
        Set up a new organizational space for your team and start managing projects instantly.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4"
        ref={formRef}
      >
        <p className={`text-red-500 text-sm ${error?.data ? '' : 'hidden'}`}>
          {error?.data ? error?.data?.message : ''}
        </p>

        <div className="w-full">
          <label className="text-xs sm:text-sm font-medium text-gray-600">Workspace Name</label>
          <input
            type="text"
            placeholder="e.g. My Company"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            {...register("workspaceName", {
              required: "Workspace name is required",
              maxLength: { value: 20, message: "Length cannot exceed 20 characters." }
            })}
          />
          {errors.workspaceName && (
            <span className="text-red-500 text-xs mt-1 block">{errors.workspaceName?.message}</span>
          )}
        </div>

        <div className="w-full">
          <label className="text-xs sm:text-sm font-medium text-gray-600">Description</label>
          <textarea
            rows={4}
            placeholder="Short description about your organization"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            {...register("description", {
              required: "Description is required",
              maxLength: { value: 255, message: "Length cannot exceed 255 characters." }
            })}
          />
          {errors.description && (
            <span className="text-red-500 text-xs mt-1 block">{errors.description?.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 sm:mt-4 rounded-xl bg-indigo-600 text-white py-2.5 sm:py-3 md:py-4 font-semibold text-sm sm:text-base hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-indigo-400"
        >
          {isLoading ? "Creating..." : "Create Workspace"}
        </button>
      </form>
    </div>
  );
}