"use client";

import { Suspense } from "react";

import { Sidebar } from "@/components/layout-admin/sidebar";
import { Header } from "@/components/layout-admin/header";
import { Footer } from "@/components/layout-admin/footer";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <Suspense fallback={null}>
                <Sidebar />
            </Suspense>
            <div className="flex flex-col flex-1 min-h-screen">
                <Header />
                <main className="flex-1 bg-muted/50 dark:bg-card/50 py-4 px-6 overflow-y-auto">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
