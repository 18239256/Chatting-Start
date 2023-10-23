import getKnowledges from "../actions/getKnowledges";
import Sidebar from "../components/sidebar/Sidebar";
import KnowledgeList from "./components/KnowledgeList";

export default async function KnowledgeLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const knowledges = await getKnowledges();

  return (
    <Sidebar>
      <div className="h-full">
        <KnowledgeList items={knowledges} />
        {children}
      </div>
    </Sidebar>
  );
}