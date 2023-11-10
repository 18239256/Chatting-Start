import EmptyState from "@/app/components/EmptyState";
import Body from "./components/Body";
import Header from "./components/Header";
import getKnowledgesById from "@/app/actions/getKnowledgesById";
import getKnowledgeFileList from "@/app/actions/LLM/getKnowledgeFileList";


interface IParams {
  knowledgeId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
    const knowledge = await getKnowledgesById(params.knowledgeId);

    if (!knowledge) {
        return (
          <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
              <EmptyState />
            </div>
          </div>
        )
    }

    const fileList = await getKnowledgeFileList(knowledge?.realName);

    return ( 
    <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
            <Header knowledge={knowledge} />
            <Body files={fileList} />
      </div>
    </div>
  );
}

export default ConversationId;