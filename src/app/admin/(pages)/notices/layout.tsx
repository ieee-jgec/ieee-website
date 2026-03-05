import { AdminAuthContainer } from '@/components/ui/AdminAuthContainer'
import React from 'react'

function NoticeAdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthContainer>
            {children}
        </AdminAuthContainer>
    )
}

export default NoticeAdminLayout;