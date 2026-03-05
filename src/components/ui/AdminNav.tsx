"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SideNav = () => {
    const pathname = usePathname();
    const navOptions = [
        {
            title: "Dashboard",
            path: "/dashboard",
        },
        {
            title: "Manage Notices",
            path: "/notices",
        },
        {
            title: "Manage Team",
            path: "/team",
        },
        {
            title: "Manage Events",
            path: "/events",
        },
        {
            title: "IAM & Access control",
            path: "/access-control",
        },
    ]

    if (pathname.includes("/auth/")) return null
    return (
        <div className='w-90 h-[calc(100vh-44px)] p-3 bg-gray-300 space-y-2 sticky top-[44px] overflow-y-auto'>
            {navOptions.map((opt: any, index: number) => (
                <div key={index}>
                    <Link href={`/admin/${opt.path}`}>
                        <button className={clsx('flex bg-gray-200 p-3 w-full rounded-xl cursor-pointer', pathname.includes(opt.path) && 'bg-white')}>
                            <span>{opt.title}</span>
                        </button>
                    </Link>
                </div>
            ))}
        </div>
    )
}
