import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getWXBasis = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.email) {
    return null;
  }
  
  try {
    const wxBasis = await prisma.wXBasis.findUnique({
      where: {
        ownerUserId: currentUser.id,
      },
      include:{
        wxContacts:{
          orderBy:{
            createdAt:'desc',
          },
          include:{
            robot: true,
          }
        },
      }    
    });
    return wxBasis;
  } catch (error: any) {
    return null;
  }
};

export default getWXBasis;