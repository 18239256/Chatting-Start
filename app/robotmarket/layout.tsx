import getCurrentUser from "../actions/getCurrentUser";
import getSharedRobots from "../actions/getSharedRobots";
import Sidebar from "../components/sidebar/Sidebar";
import ShareRobotList from "./components/ShareRobotList";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const sharedRobots = await getSharedRobots();
  const currentUser = await getCurrentUser();

  return (
    // \s*\/\/\s*@ts-expect-error
    <Sidebar>
      <div className="h-full">
        <ShareRobotList items={sharedRobots!} curUser={currentUser!}/>
        {sharedRobots?.length === 0 && children}
      </div>
    </Sidebar>
  );
}