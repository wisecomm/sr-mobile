import StockTabs from "./tabs";

export default function StockLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <StockTabs />
            <div className="flex-1 flex flex-col min-h-0">
                {children}
            </div>
        </div>
    );
}
