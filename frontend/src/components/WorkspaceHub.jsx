import Header from './Header.jsx'
import Footer from './Footer.jsx'
import AppSideBar from './AppSideBar.jsx';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function WorkspaceHub() {
  const [ open, setOpen ] = useState(false);

  return (
    <>
      <Header setOpen={setOpen}  />
      <div className="min-h-screen flex justify-center bg-linear-to-br from-slate-50 to-indigo-100 p-6">
        <AppSideBar open={open} setOpen={setOpen}/>
        <div className="flex justify-center items-center flex-col  ml-40 w-full">
          <Outlet/>
        </div>
      </div>
      <Footer />
    </>
  );
}