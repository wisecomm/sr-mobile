"use client";


import { SessionManager } from "@/components/session-manager";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <>
            <SessionManager />
            {children}
        </>
    );
}
