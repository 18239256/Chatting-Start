import getCurrentUser from "../actions/getCurrentUser";
import getMasks from "../actions/getMasks ";
import Sidebar from "../components/sidebar/Sidebar";
import MaskList from "./components/MaskList";

export default async function MasksLayout({
  children
}: {
  children: React.ReactNode,
}) {

  const masks = await getMasks();
  const currentUser = await getCurrentUser();

  return (
    // \s*\/\/\s*@ts-expect-error
    <Sidebar>
      <div className="h-full">
        <MaskList items={masks!}/>
        {masks?.length === 0 && children}
      </div>
    </Sidebar>
  );
}