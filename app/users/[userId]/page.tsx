import getUserById from "@/app/actions/getUserById";
import Header from "./components/Header";

interface IParams {
  userId: string;
}

const UserId = async ({ params }: { params: IParams }) => {
    const user = await getUserById(params.userId);
    console.log('user', user);
    return ( 
    <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
            {/* <Header user={user}/> */}
            {/* <Body initialMessages={messages} />
            <Form /> */}
      </div>
    </div>
  );
}

export default UserId;