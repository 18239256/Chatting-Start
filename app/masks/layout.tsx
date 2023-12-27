import getCurrentUser from "../actions/getCurrentUser";
import getSharedRobots from "../actions/getSharedRobots";
import Sidebar from "../components/sidebar/Sidebar";
import MaskList from "./components/MaskList";

export default async function MasksLayout({
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
        <MaskList items={sharedRobots!} curUser={currentUser!}/>
        {sharedRobots?.length === 0 && children}
      </div>
    </Sidebar>
  );
}