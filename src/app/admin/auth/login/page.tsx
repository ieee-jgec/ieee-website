"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/authContext'
import React, { useState } from 'react'

export default function AdminLoginPage() {
    const { login, isLoggingIn } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const handleLogin = (e: any) => {
        e.preventDefault();
        login(formData.email, formData.password);
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='w-[30em] bg-gray-200 p-5 flex flex-col gap-8 rounded-xl'>
                <h2 className='text-3xl text-center'>Admin Login</h2>
                <form
                    action=""
                    className='space-y-6'
                    onSubmit={handleLogin}
                >
                    <Input placeholder='Enter email' type='email' required onChange={e => setFormData(prev => ({ ...prev, email: e }))} disabled={isLoggingIn} />
                    <Input placeholder='Enter password' type='password' required onChange={e => setFormData(prev => ({ ...prev, password: e }))} disabled={isLoggingIn} />
                </form>

                <Button className='w-full justify-center' onClick={handleLogin} disabled={isLoggingIn}>
                    Login
                </Button>
            </div>

        </div>
    )
}
