import getRobotConversationById from "@/app/actions/getRobotConversationById";
import getMessages from "@/app/actions/getMessages";
import getRobotMasks from "@/app/actions/getRobotMasks";
import EmptyState from "@/app/components/EmptyState";
import Body from "./components/Body";
import Header from "./components/Header";
import Form from "./components/Form";


interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
    const conversation = await getRobotConversationById(params.conversationId);
    const messages = await getMessages(params.conversationId);
    const masks = await getRobotMasks();

    if (!conversation) {
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
            <Header conversation={conversation} masks={masks}/>
            <Body initialMessages={messages} />
            <Form />
      </div>
    </div>
  );
}

export default ConversationId;