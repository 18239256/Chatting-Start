import Sidebar from "../components/sidebar/Sidebar";
import KnowledgeList from "./components/KnowledgeList";

export default async function KnowledgeLayout({
  children
}: {
  children: React.ReactNode,
}) {
  return (
    <Sidebar>
      <div className="h-full">
        <KnowledgeList />
        {children}
      </div>
    </Sidebar>
  );
}