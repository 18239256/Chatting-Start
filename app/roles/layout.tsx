import getRoles from "../actions/getRoles";
import Sidebar from "../components/sidebar/Sidebar";
import RoleList from "./components/RoleList";

export default async function UsersLayout({
  children
}: {
  children: React.ReactNode,
}) {
  const roles = await getRoles();

  return (
    <Sidebar>
      <div className="h-full">
        <RoleList items={roles} />
        {children}
      </div>
    </Sidebar>
  );
}