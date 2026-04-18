import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ensureAuth from "./ensureAuth";

export const signUp = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
    try {
        const response = await fetch('https://project-management-platform-d4jp.onrender.com/api/v1/auth/signup', {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message || "signup failed");
        }
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const signIn = createAsyncThunk('auth/signin', async (userData,thunkAPI) => {
    try {
        const response = await fetch('https://project-management-platform-d4jp.onrender.com/api/v1/auth/login', {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            credentials: "include",
            body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message || "login failed");
        }
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const signOut = createAsyncThunk('auth/signOut', async (userData,thunkAPI) => {
    try {
        await ensureAuth();
        const response = await fetch('https://project-management-platform-d4jp.onrender.com/api/v1/auth/logout', {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            credentials: "include",
            body: JSON.stringify(userData)
        })
        const data = await response.json()
        if(data.code == 'SIGNED_OUT'){
          alert("You are Signed out. Please Login to continue");
          localStorage.setItem("user", JSON.stringify({logout:true}));
          window.location.href = '/'; 
          return data;
        }
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message || "sign-out failed");
        }
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const updateUser = createAsyncThunk('auth/update-user', async (userData,thunkAPI) => {
    try {
        await ensureAuth();
        const response = await fetch('https://project-management-platform-d4jp.onrender.com/api/v1/users/update', {
            method: "PATCH",
            headers: { "Content-Type": 'application/json' },
            credentials: "include",
            body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message || "failed to update username");
        }
        await ensureAuth();
        window.location.reload()
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const sendMail = createAsyncThunk('auth/sendMail', async (userData,thunkAPI) => {
    try {
        const response = await fetch('https://project-management-platform-d4jp.onrender.com/api/v1/auth/send-email', {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message || "failed to send email");
        }
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const sendMail2 = createAsyncThunk('auth/sendMail2', async (userData,thunkAPI) => {
    try {
        const response = await fetch('https://project-management-platform-d4jp.onrender.com/api/v1/auth/send-email', {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message || "failed to send email");
        }
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const verifyUser = createAsyncThunk('auth/verifyUser', async (userData,thunkAPI) => {
    try {
        const response = await fetch('https://project-management-platform-d4jp.onrender.com/api/v1/auth/verify-user', {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message || "failed to verify-email");
        }
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})

export const resetPassword = createAsyncThunk('auth/reset-password', async (userData,thunkAPI) => {
    try {
        const response = await fetch('https://project-management-platform-d4jp.onrender.com/api/v1/auth/reset-password', {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data.message || "failed to reset password");
        }
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})


const persistedUser = localStorage.getItem("user");
const parsedUser = persistedUser ? JSON.parse(persistedUser) : {};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoading: false,
        response: {},// for signup
        sendEmailResponse: {},
        sendEmail2Response:{},
        verifyUserResponse: {},
        resetPasswordResponse: {},
        authResponse: parsedUser,
        tempAuthResponse: {},
        updateUserResponse : {},
        error: {
            signUpError: null,
            authError: null,
            logoutError: null,
            sendMailError: null,
            sendMail2Error:null,
            verifyUserError: null,
            resetPasswordError: null,
            updateUserError: null
        }

    },
    reducers: {
        updateSendMailResponse:(state)=>{
            state.sendEmailResponse=null;
            state.error.sendMailError=null;
        },
        updateSendMail2Response:(state)=>{
            state.sendEmail2Response=null;
            state.error.sendMail2Error=null;
        },
        updateResetPasswordResponse:(state)=>{
            state.resetPasswordResponse=null;
            state.error.resetPasswordError=null;
        },
        updateLogoutResponse:(state)=>{
            state.error.logoutError = '';   
        },
        updateSignUpResponse: (state)=>{
            state.response = {},
            state.error.signUpError = null
        },
        updateVerifyUserResponse: (state)=>{
            state.verifyUserResponse = {},
            state.error.verifyUserError = null
        }
    },
    extraReducers: (builder => {
        builder.addCase(signUp.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(signUp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error.signUpError = '';
                state.response = action.payload

            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false;
                state.error.signUpError = action.payload || action.error.message || "Something went wrong.";

            })
            .addCase(signIn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error.authError = '';
                state.authResponse = action.payload
                localStorage.setItem("user", JSON.stringify(action.payload))
                state.tempAuthResponse = action.payload


            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error.authError = action.payload || action.error.message || "Something went wrong.";

            })
            .addCase(signOut.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signOut.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error.logoutError = '';
                state.authResponse = action.payload
                localStorage.setItem("user", JSON.stringify(action.payload))

            })
            .addCase(signOut.rejected, (state, action) => {
                state.isLoading = false;
                state.error.logoutError = action.payload || action.error.message || "Something went wrong.";
            })
            .addCase(sendMail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendMail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error.sendMailError = '';
                state.sendEmailResponse = action.payload

            })
            .addCase(sendMail.rejected, (state, action) => {
                state.isLoading = false;
                state.error.sendMailError = action.payload || action.error.message || "Something went wrong.";

            })
            .addCase(sendMail2.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendMail2.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error.sendMail2Error = '';
                state.sendEmail2Response = action.payload

            })
            .addCase(sendMail2.rejected, (state, action) => {
                state.isLoading = false;
                state.error.sendMail2Error = action.payload || action.error.message || "Something went wrong.";

            })
            .addCase(verifyUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error.verifyUserError = '';
                state.verifyUserResponse = action.payload
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error.verifyUserError = action.payload || action.error.message || "Something went wrong.";

            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error.resetPasswordError = '';
                state.resetPasswordResponse = action.payload
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error.resetPasswordError = action.payload || action.error.message || "Something went wrong.";

            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error.updateUserError = '';
                state.updateUserResponse = action.payload
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error.updateUserError = action.payload || action.error.message || "Something went wrong.";

            })
    })

})


export const authActions = authSlice.actions;
export default authSlice;


