import EmptyState from "@/app/components/EmptyState";
// import Body from "./components/Body";
import Header from "./components/Header";
import getRoleById from "@/app/actions/getRoleById";
import getKnowledgeFileList from "@/app/actions/LLM/getKnowledgeFileList";
import Body from "./components/Body";
import getUsers from "@/app/actions/getUsers";


interface IParams {
  roleId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
    const role = await getRoleById(params.roleId);
    const users = await getUsers();

    if (!role) {
        return (
          <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
              <EmptyState />
            </div>
          </div>
        )
    }

    return ( 
    <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
            <Header role={role} />
            <Body role={role} users={users}/>
      </div>
    </div>
  );
}

export default ConversationId;