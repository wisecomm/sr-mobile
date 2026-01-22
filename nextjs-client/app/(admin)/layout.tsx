"use client";


import { SessionWatcher } from "@/components/session-watcher";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <>
            <SessionWatcher />
            {children}
        </>
    );
}
