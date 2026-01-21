import BoardMasterDetailClientPage from "./client-page";

export async function generateStaticParams() {
    return [{ brdId: "new" }];
}

export default function BoardMasterDetailPage() {
    return <BoardMasterDetailClientPage />;
}
