import getRobotTalks from "../actions/getRobotTalks";
import getRobots from "../actions/getRobots";
import Sidebar from "../components/sidebar/Sidebar";
import RobotList from "./components/RobotList";

export default async function ConversationsLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const robots = await getRobots();
  const robotTalks = await getRobotTalks();

  return (
    // \s*\/\/\s*@ts-expect-error
    <Sidebar>
      <div className="h-full">
      <RobotList 
        robots={robots}
        initialTalks={robotTalks}
      /> 
        {children}
      </div>
    </Sidebar>
  );
}