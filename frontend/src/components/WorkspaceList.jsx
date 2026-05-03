import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useJoinWorkspaceMutation } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function WorkspaceList() {
  const formRef = useRef(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [joinWorkspace, { isLoading, isSuccess, error }] = useJoinWorkspaceMutation();

  const onSubmit = (data) => { joinWorkspace(data); };

  if (isSuccess) { navigate('/app/workspace'); }

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-12">
      <div className="rounded-2xl md:rounded-3xl bg-white shadow-lg p-4 sm:p-6 md:p-10 border border-gray-100">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center md:text-left">
          Join Your Organization Workspace
        </h3>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          {error?.data && (
            <p className="text-red-500 text-xs sm:text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {error.data.message}
            </p>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1.5">
              Organization/Workspace Name
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              className="w-full rounded-xl border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all placeholder:text-gray-400"
              {...register("workspaceName", {
                required: "Workspace name is required",
                maxLength: { value: 20, message: "Name should not exceed 20 characters." }
              })}
            />
            {errors.workspaceName && (
              <span className="text-red-500 text-xs mt-1 block">{errors.workspaceName?.message}</span>
            )}
          </div>

          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                <LoadingSpinner />
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-indigo-600 py-2.5 sm:py-3 md:py-3.5 text-white font-semibold text-sm sm:text-base hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-indigo-400 shadow-md shadow-indigo-100"
            >
              {isLoading ? "Joining..." : "Join Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}