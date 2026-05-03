import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { store } from './app/store.js'
import { Provider } from 'react-redux'
import Welcome from './components/Welcome.jsx'
import CreateUser from './components/CreateUser.jsx'
import VerifyUser from './components/VerifyUser.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Reset from './components/Reset.jsx'
import Home from './components/Home.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import { StrictMode } from 'react'
import WorkspaceHub from './components/WorkspaceHub.jsx'
import Projects from './pages/Projects.jsx'
import Team from './pages/Team.jsx'
import ProjectDetails from "./pages/ProjectDetails";
import TaskDetails from "./pages/TaskDetails";
import Dashboard from './pages/Dashboard.jsx'
import WorkspaceList from './components/WorkspaceList.jsx'
import CreateWorkspaceForm from './components/CreateWorkspaceForm.jsx'
import Profile from './components/Profile.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Settings from './components/Settings.jsx'
import Chatbot from './components/ChatBot.jsx'
import ensureAuth from './features/ensureAuth.js'
import PremiumCard from './components/PremiumCard.jsx'
import PaymentFail from './components/PaymentFail.jsx'
import PaymentSuccess from './components/PaymentSuccess.jsx'

const router = createBrowserRouter([

  {
    path: '/', element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Welcome /> },
      { path: '/create-user', element: <CreateUser /> },
      { path: '/verify-user', element: <VerifyUser /> },
      { path: '/reset', element: <Reset /> },
      { path: '/reset-password', element: <ResetPassword /> },
    ]
  },
  {
    path: '/app', element: <ProtectedRoute><WorkspaceHub /></ProtectedRoute>,
    errorElement: <ErrorPage />,
    loader: ensureAuth,
    shouldRevalidate: () =>false,
    children: [
      { path: '/app', element: <WorkspaceList /> },
      { path: '/app/payment', element:  < PremiumCard />  },
      { path: '/app/payment/success', element:  < PaymentSuccess />  },
      { path: '/app/payment/failure', element:  < PaymentFail />  },
      { path: '/app/create-workspace', element:  < CreateWorkspaceForm />  },
      { path: '/app/profile', element:  <Profile /> },
    ]
  },
  {
    path: '/app/workspace', element: <ProtectedRoute> <App/></ProtectedRoute>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element:  <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: '/app/workspace/team', element:  <Team /> },
      { path: '/app/workspace/projects', element:  <Projects /> },
      { path: '/app/workspace/settings', element:  <Settings /> },
      { path: '/app/workspace/projectsDetail', element:  <ProjectDetails /> },
      { path: '/app/workspace/taskDetails', element:  <TaskDetails /> },
      { path: '/app/workspace/chatbot', element:  <Chatbot /> },
    ]
  },
  

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
