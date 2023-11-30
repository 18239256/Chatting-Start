import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
import useRoutes from "../hooks/useRoutes";
import { usePathname } from "next/navigation";

const unique = (...args:string[]) => Array.from(new Set(args));

const getAuthRoutes = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      },
      include:{
        assignRole:true,
      }
    });

    if (!currentUser) {
      return null;
    }

    let allChans: string[] = [];
    currentUser.assignRole.map((role)=>{
      allChans = [...role.channels, ...allChans];
    });

    const authChannels = unique(...allChans);
    console.log('authChannels', authChannels);

    return authChannels;

  } catch (error: any) {
    return null;
  }
};

export default getAuthRoutes;