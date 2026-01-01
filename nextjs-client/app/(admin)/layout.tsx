"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/app/actions/auth-actions";
import { Sidebar } from "@/components/layout-admin/sidebar";
import { Header } from "@/components/layout-admin/header";
import { Footer } from "@/components/layout-admin/footer";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
