import { XIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { useCreateProjectMutation, useGetWorkspaceDetailsQuery } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import SuccessModal from "./SuccessModal";
import ErrorPage from "./ErrorPage";

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {
    const { data: currentWorkspace,isLoading, isError} = useGetWorkspaceDetailsQuery();
    const navigate = useNavigate()
    const [createProject, { isLoading:creatingProject, isSuccess, isError:createProjectIsError, error:createProjectError }] = useCreateProjectMutation();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            title: "",
            projectLink: "",
            description: "",
            status: "PLANNING",
            priority: "MEDIUM",
            startDate: "",
            endDate: "",
            teamMembers: [],
            projectLead: "",
        }
    });

    const teamMembers = watch("teamMembers");
    const startDate = watch("startDate");

    const onSubmit = async (data) => {
        createProject(data)
    };

    const removeTeamMember = (email) => {
        setValue(
            "teamMembers",
            teamMembers.filter((m) => m !== email)
        );
    };

    const handleClick = (setOpen) => {
        setOpen(false)
        reset({
            title: "",
            projectLink: "",
            description: "",
            status: "PLANNING",
            priority: "MEDIUM",
            startDate: "",
            endDate: "",
            teamMembers: [],
            projectLead: ""
        });
        setTimeout(() => {
            navigate('/app/workspace/projects');
        })
    }

    if (!isDialogOpen) return null;

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }
    if (isSuccess) {
        return (
            <SuccessModal handleClick={handleClick} message={"Your project is created successfully.."} />
        )
    }
    if (isError) {
        return (<ErrorPage  />)
    }
    
    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-zinc-900 dark:text-zinc-200 relative">

                <button
                    className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700"
                    onClick={() => setIsDialogOpen(false)}
                >
                    <XIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">Create New Project</h2>

                {currentWorkspace && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        In workspace:
                        <span className="text-blue-600 dark:text-blue-400">
                            {" "} {currentWorkspace.name}
                        </span>
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Project Name */}
                    <div>
                        <label className="block text-sm mb-1">Project Name</label>
                        <input
                            {...register("title", { required: true })}
                            placeholder="Enter project name"
                            className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm"
                        />
                    </div>

                    {/* Project Link */}
                    <div>
                        <label className="block text-sm mb-1">Project Link</label>
                        <input
                            {...register("projectLink")}
                            placeholder="Enter project link"
                            className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm mb-1">Description</label>
                        <textarea
                            {...register("description", { required: true })}
                            placeholder="Describe your project"
                            className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm h-20"
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm mb-1">Status</label>
                            <select {...register("status", { required: true })}
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm">
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Priority</label>
                            <select {...register("priority", { required: true })}
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm">
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="block text-sm mb-1">Start Date</label>
                            <input
                                type="date"
                                {...register("startDate", { required: true })}
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">End Date</label>
                            <input
                                type="date"
                                {...register("endDate", { required: true })}
                                min={startDate}
                                className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm"
                            />
                        </div>

                    </div>

                    {/* Project Lead */}
                    <div>
                        <label className="block text-sm mb-1">Project Lead</label>
                        <select
                            {...register("projectLead", { required: true })}
                            onChange={(e) => {
                                const email = e.target.value;
                                setValue("projectLead", email);

                                if (email && !teamMembers.includes(email)) {
                                    setValue("teamMembers", [...teamMembers, email]);
                                }
                            }}
                            className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm"
                        >
                            <option value="">No lead</option>
                            {currentWorkspace?.details?.workspaceUsers.map((member) => (
                                <option key={member.user.email} value={member.user.email}>
                                    {member.user.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Team Members */}
                    <div>

                        <label className="block text-sm mb-1">Team Members</label>

                        <select
                            className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-sm"
                            onChange={(e) => {
                                const email = e.target.value;
                                if (email && !teamMembers.includes(email)) {
                                    setValue("teamMembers", [...teamMembers, email]);
                                }
                            }}
                        >
                            <option value="">Add team members</option>

                            {currentWorkspace?.details?.workspaceUsers
                                ?.filter((m) => !teamMembers.includes(m.user.email))
                                .map((member) => (
                                    <option key={member.user.email} value={member.user.email}>
                                        {member.user.email}
                                    </option>
                                ))}
                        </select>

                        {teamMembers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">

                                {teamMembers.map((email) => (
                                    <div
                                        key={email}
                                        className="flex items-center gap-1 bg-blue-200/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-sm"
                                    >
                                        {email}

                                        <button
                                            type="button"
                                            onClick={() => removeTeamMember(email)}
                                        >
                                            <XIcon className="w-3 h-3" />
                                        </button>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                {creatingProject && <LoadingSpinner/>}
                {createProjectIsError && <p className="text-red-500">{createProjectError?.data?.message}</p>}
                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 text-sm">

                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(false)}
                            className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={isSubmitting || !currentWorkspace}
                            className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        >
                            {creatingProject ? "Creating..." : "Create Project"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateProjectDialog;