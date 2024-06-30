import getCurrentUser from "../actions/getCurrentUser";
import getRobotConversations from "../actions/getRobotConversations";
import getWXBasis from "../actions/getWXBasis";
import getWXIssueMessages from "../actions/getWXIssueMessages";
import Sidebar from "../components/sidebar/Sidebar";
import WXAdmin from "./components/WXAdmin";

export default async function IMEntriesLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const user = await getCurrentUser();
  const wxBasis = await getWXBasis();
  const wxIssueMessages = await getWXIssueMessages();
  const robotConversations = await getRobotConversations();
  return (
    // \s*\/\/\s*@ts-expect-error
    <Sidebar>
      <div className="h-full">
        <WXAdmin wxBasis={wxBasis} wxIssueMessges={wxIssueMessages} curUser={user} robotConversations={robotConversations}/>
      </div>
    </Sidebar>
  );
}