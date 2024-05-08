import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import getRoleById from "@/app/actions/getRoleById";
import Body from "./components/Body";
import getUsers from "@/app/actions/getUsers";
import getCurrentUser from "@/app/actions/getCurrentUser";


interface IParams {
  roleId: string;
}

const RoleId = async ({ params }: { params: IParams }) => {
    const role = await getRoleById(params.roleId);
    const users = await getUsers();
    const curUser = await getCurrentUser();
    users.push(curUser!);

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
            <Body role={role} users={users} />
      </div>
    </div>
  );
}

export default RoleId;