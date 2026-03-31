import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useJoinWorkspaceMutation } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import ErrorPage from "./ErrorPage";


export default function WorkspaceList() {
  const formRef = useRef(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate()
  const [joinWorkspace, { isLoading, isSuccess, error }] = useJoinWorkspaceMutation();

  const onSubmit = (data) => {
    joinWorkspace(data);
  };

  if (isSuccess) {
    setTimeout(() => {
      navigate('/app/workspace');
    }, 1)
  }

  return (
    <div className="w-[50%] space-y-8 relative -top-20">
      {/* Join Workspace Form */}
      <div className="rounded-3xl bg-white shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Join Your Organization Workspace
        </h3>
        {isLoading && <LoadingSpinner />}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} ref={formRef}>

           <p className={`text-red-500 ${error?.data ? '' : 'hidden'}`}>{error?.data ? error?.data?.message : ''}</p>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Organization/Workspace Name
            </label>
            <input
              type="text"
              name="workspaceName"
              placeholder="e.g. Acme Corp"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("workspaceName", {
                required: "workspaceName is required",
                maxLength: {
                  value: 20, message: "Length of workspaceName should not exceeds 20 characters."
                }
              })}
            />
            <span className="text-red-500 md:text-sm text-[12px] ">{errors.workspaceName?.message}</span>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition"
          >
            Join Workspace
          </button>
        </form>
      </div>


    </div>
  );
}
