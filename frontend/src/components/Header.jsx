import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

function Header({setOpen}) {
  

  const {authResponse} = useSelector((store)=>store.auth);
 


  function getUserName(user){
    const username = user.charAt(0).toUpperCase() + user.slice(1);
    return username;
  }

  
  
  return (

    <header className="flex md:justify-between min-w-full
    h-12 md:h-auto md:px-8 md:py-4 shadow-md bg-slate-200 items-center px-2 py-1 sticky top-0 z-20">
      <h3 className='text-md md:hidden px-3 cursor-pointer' onClick={()=>setOpen((prev)=>!prev)} >&#x2630;</h3>
      <div className='flex md:gap-5 justify-center items-center gap-2'>
        <h2 className='md:text-3xl text-blue-900 font-bold text-xl'>Projectly</h2>
        <h4 className='pt-1 text-blue-900 text-xs md:text-xl sm:text-md hidden sm:block'>A Project Management Platform</h4>
      </div>

      <div className="md:flex hidden">
        <h4 >Welcome <span>{authResponse.username?getUserName(authResponse.username):''}</span></h4>
      </div>


    </header>

  );
}

export default Header;