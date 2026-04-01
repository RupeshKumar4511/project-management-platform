import { format } from "date-fns";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AddProjectMember from "./AddProjectMember";
import LoadingSpinner from "./LoadingSpinner";
import SuccessModal from "./SuccessModal";
import ErrorPage from "./ErrorPage";
import { useGetWorkspaceDetailsQuery, useUpdateProjectMutation } from "../features/workspaceSlice";

export default function ProjectSettings({ project }) {
    const { data: currentWorkspace, isLoading } = useGetWorkspaceDetailsQuery();
    const [updateProject, { isLoading: updatingProject, isSuccess: updateProjectIsSuccess, isError: updateProjectIsError, error: updateProjectError }] = useUpdateProjectMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch
    } = useForm({
        defaultValues: {
            title: "New Website Launch",
            projectLink: "https://github.com/RupeshKumar4511/project-managment-workspace-hub",
            description: "Initial launch for new web platform.",
            status: "PLANNING",
            priority: "MEDIUM",
            startDate: new Date("2025-09-10"),
            endDate: new Date("2025-10-15"),
            progress: 0,
        }
    });

    const progress = watch("progress");

    const calculateProgress = (project) => {
        const totalTasks = project.tasks.length;
        if(totalTasks==0){
            return 0;
        }
        const completedTasks = project.tasks.reduce((acc, current) => current.status == 'DONE' ? acc + 1 : acc, 0);
        return parseInt((completedTasks / totalTasks) * 100);
    }

    useEffect(() => {
        if (project) {

            reset({
                ...project,
                startDate: new Date(project.startDate),
                endDate: new Date(project.endDate),
                progress: calculateProgress(project)
            });
        }
    }, [project, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            updateProject(data)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClick = (setOpen) => {
        setOpen(false);
        window.location.reload()
    }


    const inputClasses =
        "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";

    const cardClasses =
        "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

    const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";

    { !isDialogOpen && null };

    return (

        <div className="grid lg:grid-cols-2 gap-8">
            {isLoading && <LoadingSpinner />}

            {/* Project Details */}
            <div className={cardClasses}>
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
                    Project Details
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Project Name</label>
                        <input
                            {...register("title", { required: true })}
                            className={inputClasses}
                        />
                    </div>

                    {/* Project Link */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Project Link</label>
                        <input
                            {...register("projectLink", { required: true })}
                            className={inputClasses}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Description</label>
                        <textarea
                            {...register("description")}
                            className={inputClasses + " h-24"}
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelClasses}>Status</label>
                            <select {...register("status")} className={inputClasses}>
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={labelClasses}>Priority</label>
                            <select {...register("priority")} className={inputClasses}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className={labelClasses}>Start Date</label>
                            <Controller
                                control={control}
                                name="startDate"
                                render={({ field }) => (
                                    <input
                                        type="date"
                                        value={
                                            field.value
                                                ? format(field.value, "yyyy-MM-dd")
                                                : ""
                                        }
                                        onChange={(e) =>
                                            field.onChange(new Date(e.target.value))
                                        }
                                        className={inputClasses}
                                    />
                                )}
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <label className={labelClasses}>End Date</label>
                            <Controller
                                control={control}
                                name="endDate"
                                render={({ field }) => (
                                    <input
                                        type="date"
                                        value={
                                            field.value
                                                ? format(field.value, "yyyy-MM-dd")
                                                : ""
                                        }
                                        onChange={(e) =>
                                            field.onChange(new Date(e.target.value))
                                        }
                                        className={inputClasses}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            Progress: {progress}%
                        </label>
                        <Controller
                            control={control}
                            name="progress"
                            render={({ field }) => (
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    {...field}
                                    className="w-full accent-blue-500 dark:accent-blue-400"
                                    disabled
                                />
                            )}
                        />
                    </div>


                    {updatingProject && <LoadingSpinner />}
                    {updateProjectIsError && <p className="text-red-500">{updateProjectError?.data?.message}</p>}


                    {
                        updateProjectIsSuccess && (
                            <SuccessModal
                                handleClick={handleClick}
                                message="Your project is updated successfully.."
                            />
                        )
                    }
                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-auto flex items-center text-sm justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded"
                    >
                        <Save className="size-4" />
                        {updatingProject ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>

            {/* Team Members */}
            <div className="space-y-6">
                <div className={cardClasses}>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
                            Team Members{" "}
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                ({project.projectMembers.length})
                            </span>
                        </h2>

                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(true)}
                            className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Plus className="size-4 text-zinc-900 dark:text-zinc-300" />
                        </button>

                        <AddProjectMember
                            isDialogOpen={isDialogOpen}
                            setIsDialogOpen={setIsDialogOpen}
                        />
                    </div>

                    {project.projectMembers.length > 0 && (
                        <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                            {project.projectMembers.map((member, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-3 py-2 rounded dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-300"
                                >
                                    <span>
                                        {
                                            currentWorkspace.details.workspaceUsers
                                                .filter(
                                                    (user) =>
                                                        user.id == member?.userId
                                                )[0]?.user.email
                                        }
                                    </span>

                                    {project.projectLead === member.userId && (
                                        <span className="px-2 py-0.5 rounded-xs ring ring-zinc-200 dark:ring-zinc-600">
                                            Project Lead
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}