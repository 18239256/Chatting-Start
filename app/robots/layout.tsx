import getKnowledges from "../actions/getKnowledges";
import getKnowledgesByUserId from "../actions/getKnowledgesByUserId";
import getRobotConversations from "../actions/getRobotConversations";
import getRobotTemplates from "../actions/getRobotTemplates";
import Sidebar from "../components/sidebar/Sidebar";
import RobotList from "./components/RobotList";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const robotTmpls = await getRobotTemplates();
  let conversations = await getRobotConversations();
  const knowledges = await getKnowledges();

  return (
    // \s*\/\/\s*@ts-expect-error
    <Sidebar>
      <div className="h-full">
      <RobotList 
        knowledges={knowledges}
        robotTmpls={robotTmpls} 
        title="Robot" 
        initialItems={conversations}
      /> 
        {children}
      </div>
    </Sidebar>
  );
}