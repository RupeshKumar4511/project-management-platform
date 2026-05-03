import Header from './Header.jsx'
import Footer from './Footer.jsx'
import AppSideBar from './AppSideBar.jsx';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function WorkspaceHub() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header setOpen={setOpen} />
      <div className="min-h-screen flex justify-center bg-linear-to-br from-slate-50 to-indigo-100 p-2 sm:p-4 md:p-6">
        <AppSideBar open={open} setOpen={setOpen} />
        <div className="flex justify-center items-center flex-col w-full ml-0 sm:ml-16 md:ml-40">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}