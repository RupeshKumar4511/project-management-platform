import { useForm } from "react-hook-form";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDeleteWorkspaceMutation, useGetWorkspaceDetailsQuery, useUpdateWorkspaceMutation } from "../features/workspaceSlice";
import SuccessModal from "./SuccessModal";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [workspace, setWorkspace] = useState({ id: '', name: '', description: '', owner: '' });

    const navigate = useNavigate();

    const { data: currentWorkspace } = useGetWorkspaceDetailsQuery();
    const [updateWorkspace, { isLoading: updatingWorkspace, isSuccess: updateWorkspaceIsSuccess, isError: updateWorkspaceIsError, error: updateWorkspaceError }] = useUpdateWorkspaceMutation()
    const [deleteWorkspace, { isLoading: deletingWorkspace, isSuccess: deleteWorkspaceIsSuccess, isError: deleteWorkspaceIsError, error: deleteWorkspaceError }] = useDeleteWorkspaceMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = useForm();

    const setWorkspaceData = () => {

        if (!currentWorkspace) return
        reset({
            name: currentWorkspace.details.name,
            description: currentWorkspace.details.description,
        })
        setWorkspace({
            id: currentWorkspace.details.id,
            name: currentWorkspace.details.name,
            description: currentWorkspace.details.description,
            owner: getOwnerEmail(currentWorkspace.details.ownerId)
        })
    }

    useEffect(() => {
        setWorkspaceData();
    }, [currentWorkspace])


    function getOwnerEmail(ownerId) {
        if (ownerId) {
            const owner = currentWorkspace?.details?.workspaceUsers?.filter((user) => user.user.id === ownerId)[0];
            return owner?.user?.email;
        }

    }


    const onSubmit = (data) => {
        updateWorkspace({ ...data, workspaceId: workspace.id });
    };

    const handleDelete = () => {
        console.log(workspace.id)
        // deleteWorkspace(workspace.id);
    };

    const handleUpdateWorkspace = (setOpen) => {
        setOpen(false);

    }

    const handleDeleteWorkspace = (setOpen) => {
        setOpen(false);
        setTimeout(() => {
            navigate('/app')
        })

    }




    const cardClasses =
        "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

    const inputClasses =
        "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";

    const labelClasses = "text-sm font-bold text-zinc-600 dark:text-zinc-400";

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Workspace Info */}
            <div className={cardClasses}>
                <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-300">
                    Workspace Settings
                </h2>

                <p className="text-red-500">{updateWorkspaceIsError && updateWorkspaceError?.data?.message}</p>

                {/* Update Name */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className={labelClasses}>Workspace Name : </label>
                        <input
                            {...register("name", {
                                required: "workspaceName is required",
                                maxLength: {
                                    value: 20, message: "Length of workspaceName cannot exceeds 20 characters."
                                }
                            })}
                            className={inputClasses}
                        />
                    </div>

                    {/* Description  */}
                    <div>
                        <label className={labelClasses}>Description : </label>
                        <textarea
                            rows={3}
                            {...register("description", {
                                maxLength: {
                                    value: 255, message: "Length of description cannot exceeds 255 characters."
                                }
                            })}
                            className={inputClasses}
                        />
                    </div>

                    {/* Owner */}
                    <div>
                        <label className={labelClasses}>Owner : </label>
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-400">
                            {workspace?.owner}
                        </p>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={updatingWorkspace}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                    >
                        <Save className="size-4" />
                        {updatingWorkspace ? "Saving..." : "Update Workspace"}
                    </button>

                    {updateWorkspaceIsSuccess && <SuccessModal message={"Workspace Updated Successfully."} handleClick={handleUpdateWorkspace} />}

                </form>
            </div>

            {deleteWorkspaceIsSuccess && <SuccessModal message={"Workspace Deleted Successfully."} handleClick={handleDeleteWorkspace} />}

            {/* Danger Zone */}
            <div className={cardClasses}>
                <h2 className="text-lg font-medium text-red-500 mb-4">
                    Danger Zone
                </h2>
                <p className="text-red-500">{deleteWorkspaceIsError && deleteWorkspaceError?.data?.message}</p>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                    >
                        <Trash2 className="size-4" />
                        Delete Workspace
                    </button>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Are you sure? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                            >
                                {deletingWorkspace ? "Deleting" : "Yes, Delete"}
                            </button>

                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded text-sm border border-zinc-300 dark:border-zinc-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
