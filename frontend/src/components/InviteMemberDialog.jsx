import { Mail, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAddWorkspaceMemberMutation, useGetWorkspaceDetailsQuery } from "../features/workspaceSlice";
import LoadingSpinner from "./LoadingSpinner";
import SuccessModal from "./SuccessModal";
import ErrorPage from "./ErrorPage";
import { useNavigate } from "react-router-dom";

const InviteMemberDialog = ({ isDialogOpen, setIsDialogOpen }) => {

    const { data: currentWorkspace, isLoading,isError } = useGetWorkspaceDetailsQuery();
    const [addWorkspaceMember, { isLoading:addingWorkspaceMember, isSuccess:addWorkspaceMemberIsSuccess, isError:addWorkspaceMemberIsError,error:addWorkspaceMemberError }] = useAddWorkspaceMemberMutation();

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            email: "",
            role: "org:member",
        }
    });

    const onSubmit = async (data) => {
        try {
            addWorkspaceMember(data)

        } catch (error) {
            console.error(error);
        }
    };
    const handleClick = () => {
        setIsDialogOpen(false);
        reset({
           email: "",
            role: "org:member",
        });
        setTimeout(() => {
            navigate('/app/workspace/team');
        })
    }

    if (!isDialogOpen) return null;

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }
    if (addWorkspaceMemberIsSuccess) {
        return (
            <SuccessModal handleClick={handleClick} message={"workspace member added successfully.."} />
        )
    }
    if (isError) {
        return (<ErrorPage />)
    }


    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200">

                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" />
                        Invite Team Member
                    </h2>

                    {currentWorkspace && (
                        <p className="text-sm text-zinc-700 dark:text-zinc-400">
                            Inviting to workspace:
                            <span className="text-blue-600 dark:text-blue-400">
                                {" "} {currentWorkspace.name}
                            </span>
                        </p>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 w-4 h-4" />

                            <input
                                type="email"
                                placeholder="Enter email address"
                                {...register("email", { required: true })}
                                className="pl-10 mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                            Role
                        </label>

                        <select
                            {...register("role")}
                            className="w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 py-2 px-3 mt-1 focus:outline-none focus:border-blue-500 text-sm"
                        >
                            <option value="org:member">Member</option>
                            <option value="org:admin">Admin</option>
                        </select>
                    </div>

                    {addingWorkspaceMember && <LoadingSpinner/>}
                {addWorkspaceMemberIsError && <p className="text-red-500">{addWorkspaceMemberError?.data?.message}</p>}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(false)}
                            className="px-5 py-2 rounded text-sm border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || !currentWorkspace}
                            className="px-5 py-2 rounded text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 hover:opacity-90 transition"
                        >
                            {addingWorkspaceMember ? "Sending..." : "Send Invitation"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default InviteMemberDialog;