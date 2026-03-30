import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000/api/v1/workspace',
    // Global credentials setting so you don't have to repeat it in every endpoint
    prepareHeaders: (headers) => {
        return headers;
    }
});


const baseQueryWithReauth = async (args, api, extraOptions) => {
    // 1. Run the original request
    let result = await baseQuery(args, api, extraOptions);

    // 2. Check if it failed with 401
    if (result.error && result.error.status === 401 && result.error.data?.message == "Token expired") {
        console.log('Token expired, attempting refresh...');

        // 3. Attempt to get a new token (using a dedicated refresh endpoint)
        // Adjust the URL to your actual refresh endpoint
        const refreshResult = await baseQuery({ 
            url: 'http://localhost:3000/api/v1/auth/refresh', 
            method: 'POST',
            credentials: "include" 
        }, api, extraOptions);

        if (refreshResult.data && refreshResult.data?.success) {
            console.log('Refresh successful, retrying original request');
            // 4. Retry the original request with the new session
            result = await baseQuery(args, api, extraOptions);
        } else {
            console.log('Refresh failed, logging out');
            alert("You are Signed out. Please Login to continue");
            window.location.href = '/';
        }
    }
    return result;
};

export const workspace = createApi({
    reducerPath: 'workspace',
    tagTypes: ['workspace-details', 'my-tasks','comments'],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getWorkspaceDetails: builder.query({
            query: () => ({
                url: '/get-details',
                method: 'GET',
                credentials:"include",
            }),
            providesTags: ['workspace-details']
        }),
        getUserTasks: builder.query({
            query: () => ({
                url: '/get-my-tasks',
                method: 'GET',
                credentials:"include",
            }),
            providesTags: ['my-tasks']
        }),
        createWorkspace: builder.mutation({
            query: (post) => ({
                url: '/create-workspace',
                method: 'POST',
                credentials:"include",
                body: post,
                
            })
        }),
        joinWorkspace: builder.mutation({
            query: (data) => ({
                url: '/join-workspace',
                method: 'POST',
                credentials:"include",
                body: data
            }),
        }),
        createProject: builder.mutation({
            query: (data) => ({
                url: '/create-project',
                method: 'POST',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workpace-details']

        }),
        createTask: builder.mutation({
            query: (data) => ({
                url: '/create-task',
                method: 'POST',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workpace-details']

        }),
        addWorkspaceMember: builder.mutation({
            query: (data) => ({
                url: '/add-workspace-member',
                method: 'POST',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workpace-details']

        }),
        addProjectMember: builder.mutation({
            query: (data) => ({
                url: '/add-project-member',
                method: 'POST',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workpace-details']

        }),
        getComment: builder.query({
            query: (taskId) => ({
                url: `/get-comments/${taskId}`,
                method: 'GET',
                credentials:"include",
            }),
            invalidatesTags: ['comments']

        }),
        addComment: builder.mutation({
            query: (data) => ({
                url: '/add-comment',
                method: 'POST',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['comments']

        }),
        updateWorkspace: builder.mutation({
            query: (data) => ({
                url: `/update-workspace/${data.workspaceId}`,
                method: 'PUT',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workspace-details']

        }),
        updateProject: builder.mutation({
            query: (data) => ({
                url: `/update-project/${data.id}`,
                method: 'PUT',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workspace-details']

        }),
        updateTask: builder.mutation({
            query: (data) => ({
                url: `/update-task/${data.taskId}`,
                method: 'PUT',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workspace-details']

        }),
        updateTaskStatus: builder.mutation({
            query: (data) => ({
                url: `/update-task-status/${data.taskId}`,
                method: 'PATCH',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workspace-details']

        }),
        updateProjectMember: builder.mutation({
            query: (data) => ({
                url: '/update-project-member',
                method: 'PUT',
                credentials:"include",
                body: data
            }),
            invalidatesTags: ['workspace-details']

        }),
        deleteWorkspace: builder.mutation({
            query: (id) => ({
                url: `/delete-workspace/${id}`,
                credentials:"include",
                method: 'DELETE'
            }),
            invalidatesTags: ['workpace-details']

        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/delete-project/${id}`,
                credentials:"include",
                method: 'DELETE'
            }),
            invalidatesTags: ['workpace-details']

        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/delete-task/${id}`,
                credentials:"include",
                method: 'DELETE'
            }),
            invalidatesTags: ['workspace-details']

        }),
        deleteWorkspaceMember: builder.mutation({
            query: (id) => ({
                url: `/delete-workspace-member/${id}`,
                credentials:"include",
                method: 'DELETE'
            }),
            invalidatesTags: ['workpace-details']

        }),
        deleteProjectMember: builder.mutation({
            query: (data) => ({
                url: `/delete-project-member?userId=${data.userId}&projectId=${data.projectId}`,
                credentials:"include",
                method: 'DELETE'
            }),
            invalidatesTags: ['workpace-details']

        }),
        deleteComments: builder.mutation({
            query: (id) => ({
                url: `/delete-comments/${id}`,
                credentials:"include",
                method: 'DELETE'
            }),
            invalidatesTags: ['comments']

        }),
        
    })
})


export const { useGetWorkspaceDetailsQuery, useGetUserTasksQuery,useGetCommentQuery, useJoinWorkspaceMutation, useCreateWorkspaceMutation,useCreateProjectMutation,useCreateTaskMutation,useAddWorkspaceMemberMutation,useAddProjectMemberMutation,useAddCommentMutation,useUpdateWorkspaceMutation,useUpdateProjectMemberMutation,useUpdateProjectMutation,useUpdateTaskMutation, useUpdateTaskStatusMutation,useDeleteWorkspaceMutation,useDeleteProjectMutation,useDeleteTaskMutation,useDeleteProjectMemberMutation,useDeleteWorkspaceMemberMutation,useDeleteCommentsMutation} = workspace;


