import { useGetWorkspaceDetailsQuery } from "../features/workspaceSlice";
import LoadingSpinner from "./LoadingSpinner";
import ErrorPage from "./ErrorPage";
import { Building2 } from 'lucide-react';

function WorkspaceDropdown() {

    const { data: currentWorkspace, isLoading, error } = useGetWorkspaceDetailsQuery();

    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    if (error) {
        return (<ErrorPage />)
    }
    return (
        <div className="relative m-4" >
            <button className="w-full flex items-center justify-between p-3 h-auto text-left rounded hover:bg-gray-100 dark:hover:bg-zinc-800" >
                <div className="flex items-center gap-3">
                     <Building2 className="w-8 h-8 rounded shadow" />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {currentWorkspace?.details.name || "Select Workspace"}
                        </p>
                    </div>
                </div>
            </button>
        </div>
    );
}

export default WorkspaceDropdown;
