import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getWXIssueMessages = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.email) {
    return null;
  }
  
  try {
    const wxIssueMessages = await prisma.wXIssueMessages.findMany({
      where: {
        deliveried: false,
        recipient:{
          wxInstance:{
            ownerUserId: currentUser.id,
          }
        }
      },
      include:{
        recipient:true,
      }    
    });
    return wxIssueMessages;
  } catch (error: any) {
    return null;
  }
};

export default getWXIssueMessages;