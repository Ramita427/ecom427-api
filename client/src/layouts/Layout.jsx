import React from 'react'
import { Outlet, Link } from 'react-router-dom'; 
import MainNav from '../components/MainNav'

const Layout = () => {
  return (
    <div>
      <MainNav />
      
      <main className="min-h-screen">
        <Outlet /> 
      </main>
      <FloatingHomeButton />
    </div>
  );
};

const FloatingHomeButton = () => {
  return (
    <Link
      to="/"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-blue-500 text-white p-3.5 rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition-all duration-200 group"
      title="กลับหน้าหลัก"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out text-sm font-medium whitespace-nowrap">
        Home
      </span>
    </Link>
  );
};

export default Layout;