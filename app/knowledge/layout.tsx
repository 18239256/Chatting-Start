import { Knowledge } from "@prisma/client";
import getCurrentUser from "../actions/getCurrentUser";
import getKnowledges from "../actions/getKnowledges";
import Sidebar from "../components/sidebar/Sidebar";
import KnowledgeList from "./components/KnowledgeList";

export default async function KnowledgeLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const user = await getCurrentUser();
  let knowledges: Knowledge[];
  if(user)
    knowledges = await getKnowledges(user?.id);
  else
    knowledges=[]
  return (
    <Sidebar>
      <div className="h-full">
        <KnowledgeList items={knowledges} />
        {children}
      </div>
    </Sidebar>
  );
}