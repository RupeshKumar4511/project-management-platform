import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { CgProfile, CgMail, CgShield, CgCheck, CgClose } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import ErrorPage from './ErrorPage';
import { updateUser } from "../features/authSlice";

const Profile = () => {
  const { authResponse } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(authResponse?.username || "");

  if (!authResponse?.success || authResponse?.logout) {
    return <ErrorPage />;
  }

  const getUserName = (user) => {
    return user ? user.charAt(0).toUpperCase() + user.slice(1) : "User";
  };

  const handleSave = async () => {
    dispatch(updateUser({ newUserName: newName }));
    setIsEditing(false);
  };

  return (
    // min-h-screen ensures background color covers the whole mobile view
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section: Centered on mobile for better balance */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-white">Your Profile</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">Manage your profile information.</p>
        </div>

        {/* Layout Grid: Stacks vertically on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center">
            <div className="relative">
              <div className="size-20 md:size-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4 ring-4 ring-white dark:ring-zinc-800">
                <CgProfile className="size-10 md:size-12" />
              </div>
              <span className="absolute bottom-5 right-0 size-4 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
            </div>

            {isEditing ? (
              <div className="w-full space-y-3 mb-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
                  >
                    <CgCheck size={18} /> Save
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); setNewName(authResponse.username); }}
                    className="flex-1 flex items-center justify-center gap-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 py-2 rounded-lg text-xs font-semibold"
                  >
                    <CgClose size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg md:text-xl font-bold dark:text-white break-all">{getUserName(authResponse.username)}</h2>
                <p className="text-xs md:text-sm text-zinc-500 mb-6">{authResponse?.role || "Standard Member"}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 w-full justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 rounded-xl transition-all font-medium text-sm active:scale-95"
                >
                  <CiEdit size={18} /> Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Right Column: Personal Information Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 md:p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-md md:text-lg font-semibold mb-4 dark:text-white">Personal Information</h3>
              <div className="space-y-3">
                
                {/* Email Item */}
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors">
                  <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm shrink-0">
                    <CgMail className="text-blue-500" size={18} />
                  </div>
                  <div className="flex flex-col min-w-0"> {/* min-w-0 helps with text truncation */}
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Email Address</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-medium text-sm md:text-base truncate">
                      {authResponse?.email || "example@gmail.com"}
                    </span>
                  </div>
                </div>

                {/* Security Item */}
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-transparent">
                  <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm shrink-0">
                    <CgShield className="text-purple-500" size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Account Security</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-medium text-sm">Verified Account</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
