"use client";

import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export const AdminAuthContainer = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    if (isAuthenticated) return children;
    else null;
}
