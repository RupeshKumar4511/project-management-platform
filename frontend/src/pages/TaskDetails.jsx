import { format } from "date-fns";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarIcon, MessageCircle, PenIcon } from "lucide-react";
import { useAddCommentMutation, useDeleteCommentsMutation, useGetCommentQuery, useGetWorkspaceDetailsQuery } from "../features/workspaceSlice";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";

const TaskDetails = () => {

    const { data: currentWorkspace, isSuccess } = useGetWorkspaceDetailsQuery();
    const [addComment, { isLoading: addingComment, isSuccess: addCommentIsSuccess, isError: addCommentIsError, error: addCommentError, reset:addCommentReset }] = useAddCommentMutation()
    const [deleteComments, { isLoading: deletingComments, isSuccess: deleteCommentsIsSuccess, isError: deleteCommentsIsError, error: deleteCommentsError,reset:deleteCommentsReset }] = useDeleteCommentsMutation()

    const { authResponse: user } = useSelector((store) => store.auth);

    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");


    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);


    const calculateProgress = (project) => {
        const totalTasks = project.tasks.length;
        if(totalTasks==0){
            return 0;
        }
        const completedTasks = project.tasks.reduce((acc, current) => current.status == 'DONE' ? acc + 1 : acc, 0);
        return parseInt((completedTasks / totalTasks) * 100);
    }


    const fetchTaskDetails = async () => {
        setLoading(true);
        if (!projectId || !taskId) return;
        if (isSuccess) {
            const proj = currentWorkspace?.details?.projects.find((p) => p.id === projectId);
            if (!proj) return;

            const tsk = proj.tasks.find((t) => t.id === taskId);
            if (!tsk) return;

            setTask(tsk);
            setProject({ ...proj, progress: calculateProgress(proj) });
        }

        setLoading(false);
    };
    const { data: fetchedComments, isSuccess: fetchCommentIsSuccess, refetch } = useGetCommentQuery(task?.id);

    useEffect(()=>{
         refetch();
        
        setTimeout(async() => {
           await fetchComments();
        }, 1)
    },[task,fetchedComments])

    const fetchComments = async () => {
        if (fetchCommentIsSuccess) {
            setComments(fetchedComments?.comments);
        }
    };

    const refresh = async () => {
        refetch();
        
        setTimeout(() => {
            fetchComments();
        }, 1)
    }

    const handleDeleteComments = async() => {
        if (task) {
            deleteComments(task?.id);
            await refresh();
        }
    };


    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        addComment({ taskId: task.id, content: newComment });
        setNewComment("");
        await refresh();
    };
    const getUserNameById = (assigneeId) => {
        const user = currentWorkspace?.details?.workspaceUsers?.filter(users => users.id == assigneeId)[0];
        return user?.user?.username;
    }

    useEffect(() => { fetchTaskDetails(); }, [taskId, currentWorkspace]);

    useEffect(() => {
        if (taskId && task) {
            fetchComments();
        }
    }, [taskId, task, fetchCommentIsSuccess]);

    if (addingComment) {
        toast.loading("Adding comment...");
    }

    if (addCommentIsSuccess) {
        toast.dismissAll();
        toast.success("Comment added.");
        addCommentReset()

    }

    if (addCommentIsError) {
        toast.dismissAll();
        toast.error(addCommentError?.data?.message);
        addCommentReset()
    }

    if (deletingComments) {
        toast.loading("Deleting comment...");
    }

    if (deleteCommentsIsSuccess) {
        toast.dismissAll();
        toast.success("Comment deleted.");
        deleteCommentsReset()

    }

    if (deleteCommentsIsError) {
        toast.dismissAll();
        toast.error(deleteCommentsError?.data?.message);
        deleteCommentsReset()
    }

    if (loading) return <div className="text-gray-500 dark:text-zinc-400 px-4 py-6">Loading task details...</div>;
    if (!task) return <div className="text-red-500 px-4 py-6">Task not found.</div>;

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-gray-900 dark:text-zinc-100 max-w-6xl mx-auto">
            {/* Left: Comments / Chatbox */}
            <div className="w-full lg:w-2/3">
                <div className="p-5 rounded-md  border border-gray-300 dark:border-zinc-800  flex flex-col lg:h-[80vh]">
                    <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                        <MessageCircle className="size-5" /> Task Discussion ({comments.length})
                    </h2>

                    <div className="flex-1 md:overflow-y-scroll no-scrollbar">
                        {comments.length > 0 ? (
                            <div className="flex flex-col gap-4 mb-6 mr-2">
                                {comments.map((comment) => (
                                    <div key={comment?.id} className={`sm:max-w-4/5 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 border border-gray-300 dark:border-zinc-700 p-3 rounded-md ${comment?.authorId === user?.id ? "ml-auto" : "mr-auto"}`} >
                                        <div className="flex items-center gap-2 mb-1 text-sm text-gray-500 dark:text-zinc-400">
                                            <CgProfile alt="avatar" className="size-5 rounded-full" />
                                            <span className="font-medium text-gray-900 dark:text-white">{getUserNameById(comment?.authorId)}</span>
                                            <span className="text-xs text-gray-400 dark:text-zinc-600">
                                                • {format(new Date(comment?.createdAt), "dd MM yyyy, HH:mm:ss")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-zinc-200">{comment?.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 dark:text-zinc-500 mb-4 text-sm">No comments yet. Be the first!</p>
                        )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md p-2 text-sm text-gray-900 dark:text-zinc-200 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
                            rows={3}
                        />
                        <button onClick={handleAddComment} className="bg-gradient-to-l from-blue-500 to-blue-600 transition-colors text-white text-sm px-5 py-2 rounded " >
                            Post
                        </button>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-2 text-zinc-200">
                    <button className="cursor-pointer bg-green-500 p-2 rounded-md" onClick={refresh}>Refresh</button>
                    <button className="cursor-pointer bg-red-500 p-2 rounded-md" onClick={handleDeleteComments}>Delete Comments</button>
                </div>
            </div>


            {/* Right: Task + Project Info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                {/* Task Info */}
                <div className="p-5 rounded-md bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 ">
                    <div className="mb-3">
                        <h1 className="text-lg font-medium text-gray-900 dark:text-zinc-100">{task.title}</h1>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 text-xs">
                                {task.status}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-300 text-xs">
                                {task.type}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-green-200 dark:bg-emerald-900 text-green-900 dark:text-emerald-300 text-xs">
                                {task.priority}
                            </span>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">{task.description}</p>
                    )}

                    <hr className="border-zinc-200 dark:border-zinc-700 my-3" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-2">
                            <CgProfile className="size-5 rounded-full" alt="avatar" />
                            {getUserNameById(task.assigneeId) || "Unassigned"}
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-4 text-gray-500 dark:text-zinc-500" />
                            Due : {format(new Date(task.dueDate), "dd MMM yyyy")}
                        </div>
                    </div>
                </div>

                {/* Project Info */}
                {project && (
                    <div className="p-4 rounded-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-gray-300 dark:border-zinc-800 ">
                        <p className="text-xl font-medium mb-4">Project Details</p>
                        <h2 className="text-gray-900 dark:text-zinc-100 flex items-center gap-2"> <PenIcon className="size-4" /> {project.name}</h2>
                        <p className="text-xs mt-3">Project Start Date: {format(new Date(project.startDate), "dd MMM yyyy")}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-zinc-400 mt-3">
                            <span>Status: {project.status}</span>
                            <span>Priority: {project.priority}</span>
                            <span>Progress: {project.progress || 0}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
