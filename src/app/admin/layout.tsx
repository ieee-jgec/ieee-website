import { SideNav } from '@/components/ui/AdminNav';
import { AuthProvider } from '@/context/authContext';
import { Metadata } from 'next';
import React from 'react'
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: "Admin | IEEE Student Branch JGEC"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <AuthProvider>
            <div>
                <div className='bg-gray-300 w-full sticky top-0 p-2 z-50'>
                    <h5 className='text-xl font-semibold'>IEEE JGEC Admin panel</h5>
                </div>
                <div className='flex'>
                    {/* admin nav section */}
                    <SideNav />

                    <div className='flex-1 w-full min-h-[calc(100vh-44px)] p-3'>
                        {children}
                    </div>
                </div>
                <ToastContainer
                    autoClose={2500}
                    position='bottom-right'
                    pauseOnHover={false}
                />
            </div>
        </AuthProvider>
    )
};