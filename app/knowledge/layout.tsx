import { Knowledge } from "@prisma/client";
import getCurrentUser from "../actions/getCurrentUser";
import getKnowledgesByUserId from "../actions/getKnowledgesByUserId";
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
    knowledges = await getKnowledgesByUserId(user?.id);
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