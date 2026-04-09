import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useCreateTaskMutation, useGetWorkspaceDetailsQuery, useUpdateTaskMutation } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import SuccessModal from "./SuccessModal";
import ErrorPage from "./ErrorPage";

export default function CreateTaskDialog({ showCreateTask, setShowCreateTask, projectId, taskTobeUpdated }) {

    const { data: currentWorkspace, isLoading, isError } = useGetWorkspaceDetailsQuery();
    const project = currentWorkspace?.details?.projects.find((p) => p.id === projectId);
    const members = project.projectMembers.map(member => {
        if (member.userId != null) {
            return member.userId
        }
    });
    const teamMembers = currentWorkspace.details.workspaceUsers.map(user => {
        if (members.includes(user.id)) {
            return { email: user.user.email, userId: user.id };
        }
    })

    const [createTask, { isLoading: creatingTask, isSuccess: createTaskIsSuccess, isError: createTaskIsError, error: createTaskError }] = useCreateTaskMutation();

    const [updateTask, { isLoading:updatingTask, isSuccess: updateTaskIsSuccess, isError: updateTaskIsError, error: updateTaskError }] = useUpdateTaskMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    




    const {
        register,
        handleSubmit,
        watch,
        reset
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            type: "TASK",
            status: "TODO",
            priority: "MEDIUM",
            assigneeId: null,
            dueDate: ""
        }
    });

    useEffect(() => {
        if(taskTobeUpdated){
            reset({ title: taskTobeUpdated.title, description: taskTobeUpdated.description, type: taskTobeUpdated.type, status: taskTobeUpdated.status, priority: taskTobeUpdated.priority, assigneeId: taskTobeUpdated.assigneeId, dueDate: format(new Date(taskTobeUpdated.dueDate), "dd-MM-yyyy") })
        }
    }, [reset, taskTobeUpdated])

    const dueDate = watch("dueDate");

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {

            if(taskTobeUpdated){
                console.log({...data,projectId:taskTobeUpdated.projectId,taskId:taskTobeUpdated.id})
                updateTask({...data,projectId:taskTobeUpdated.projectId,taskId:taskTobeUpdated.id})
            }else{
                createTask({ ...data, projectId: project.id })
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleClick = (setOpen) => {
        setShowCreateTask(false);
        setOpen(false);
        reset({
            title: "",
            description: "",
            type: "TASK",
            status: "TODO",
            priority: "MEDIUM",
            assigneeId: "",
            dueDate: ""
        });

    }

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }
    if (createTaskIsSuccess) {
        return (
            <SuccessModal handleClick={handleClick} message={"Your task is created successfully.."} />
        )
    }
    if (updateTaskIsSuccess) {
        return (
            <SuccessModal handleClick={handleClick} message={"Your task is updated successfully.."} />
        )
    }

    if (isError) {
        return (<ErrorPage />)
    }

    return showCreateTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md p-6 text-zinc-900 dark:text-white">

                <h2 className="text-xl font-bold mb-4">{taskTobeUpdated ? "Update Task" : "Create New Task"}</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Title</label>
                        <input
                            {...register("title", { required: true })}
                            placeholder="Task title"
                            className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            {...register("description")}
                            placeholder="Describe the task"
                            className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Type & Priority */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Type</label>
                            <select
                                {...register("type")}
                                className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1"
                            >
                                <option value="BUG">Bug</option>
                                <option value="FEATURE">Feature</option>
                                <option value="TASK">Task</option>
                                <option value="IMPROVEMENT">Improvement</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Priority</label>
                            <select
                                {...register("priority")}
                                className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                    </div>

                    {/* Assignee & Status */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Assignee</label>
                            <select
                                {...register("assigneeId")}
                                className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1"
                            >
                                <option value="">Unassigned</option>
                                {teamMembers.map((member) => (
                                    <option key={member?.userId} value={member?.userId}>
                                        {member?.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                {...register("status")}
                                className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>

                    </div>

                    {/* Due Date */}
                    <div className="space-y-1">

                        <label className="text-sm font-medium">Due Date</label>

                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-5 text-zinc-500 dark:text-zinc-400" />

                            <input
                                type="date"
                                {...register("dueDate")}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1"
                            />
                        </div>

                        {dueDate && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {format(new Date(dueDate), "dd-MM-yyyy")}
                            </p>
                        )}

                    </div>
                    {creatingTask && <LoadingSpinner/>}
                    {createTaskIsError && <p className="text-red-500">{createTaskError?.data?.message}</p>}
                    
                    {updatingTask && <LoadingSpinner/>}
                    {updateTaskIsError && <p className="text-red-500">{updateTaskError?.data?.message}</p>}

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-2">

                        <button
                            type="button"
                            onClick={() => setShowCreateTask(false)}
                            className="rounded border border-zinc-300 dark:border-zinc-700 px-5 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded px-5 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white dark:text-zinc-200 transition"
                        >
                            {creatingTask ? "Creating..." : taskTobeUpdated ? "Update Task" : "Create Task"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    ) : null;
}