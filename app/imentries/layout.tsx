import getCurrentUser from "../actions/getCurrentUser";
import getRobotConversations from "../actions/getRobotConversations";
import getWXBasis from "../actions/getWXBasis";
import Sidebar from "../components/sidebar/Sidebar";
import WXAdmin from "./components/WXAdmin";

export default async function IMEntriesLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const user = await getCurrentUser();
  const wxBasis = await getWXBasis();
  const robotConversations = await getRobotConversations();
  return (
    // \s*\/\/\s*@ts-expect-error
    <Sidebar>
      <div className="h-full">
        <WXAdmin wxBasis={wxBasis} curUser={user} robotConversations={robotConversations}/>
      </div>
    </Sidebar>
  );
}