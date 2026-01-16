"use client";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <div className="flex flex-col flex-1 min-h-screen">
                <main className="flex-1 bg-muted/50 dark:bg-card/50 p-2">
                    {children}
                </main>
            </div>
        </div>
    );
}
