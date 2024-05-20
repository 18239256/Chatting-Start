import getUserById from "@/app/actions/getUserById";
import Header from "./components/Header";
import EmptyState from "../components/EmptyState";
import Body from "./components/Body";
import getRoles from "@/app/actions/getRoles";
import getRobotTemplates from "@/app/actions/getRobotTemplates";
import getKnowledgesByUserId from "@/app/actions/getKnowledgesByUserId";
import getWXBasis from "@/app/actions/getWXBasis";

interface IParams {
  userId: string;
}

const UserId = async ({ params }: { params: IParams }) => {
  const user = await getUserById(params.userId);
  const roles = await getRoles();
  const robotTmpls = await getRobotTemplates();
  const knowledges = await getKnowledgesByUserId(params.userId);
  const wxBasis = await getWXBasis();

  if (!user) {
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
        <Header user={user} />
        <Body user={user} roles={roles} knowledges={knowledges} robotTmpls={robotTmpls} wxBasis={wxBasis}/>
      </div>
    </div>
  );
}

export default UserId;