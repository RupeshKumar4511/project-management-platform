import { Link } from "react-router-dom";

const LoginModalFooter = ({ setOpen }) => {
  const handleGithubLogin = () => {
    window.location.href = `https://project-management-platform-d4jp.onrender.com/api/v1/auth/github`;
  };

  return (
    <div className="flex flex-col gap-3 px-2">

      {/* GitHub Login Button */}
      <button
        onClick={handleGithubLogin}
        className="flex items-center justify-center gap-2 rounded-md bg-black text-white px-3 py-2 font-semibold hover:bg-gray-900 active:bg-gray-800 cursor-pointer"
      >
        {/* Optional GitHub icon */}
         <FaGithub size={22} title="Login with Github" />
       
      </button>

      {/* Existing footer */}
      <div className="flex justify-end gap-5">
        <Link
          to="/reset"
          className="cursor-pointer text-sm relative md:top-2 top-1 text-blue-800"
          onClick={() => setOpen(false)}
        >
          Reset Password
        </Link>

        <button
          className="rounded-md bg-gray-300 px-2 md:px-4 py-1 font-semibold hover:bg-gray-400/80 active:bg-gray-400/60 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-md bg-blue-300 px-2 md:px-4 py-1 font-semibold hover:bg-blue-400/80 active:bg-blue-400/60 cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default LoginModalFooter;