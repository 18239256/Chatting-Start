import bcrypt from "bcryptjs";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { now } from "next-auth/client/_utils";

export async function POST(
  request: Request
) {
    try{
        const body = await request.json();
        
        const {
            name,
            description,
            robotTmpl,
            knowledgeBaseName,
            searchEngineName,
            ownerUserId,
        } = body;

        if(!name || !robotTmpl){
            return new NextResponse('Missing info',{status: 400});
        }
        // 密码与机器人的名字相同
        // const hashedPassword = await bcrypt.hash(name, 12);

        const currentUser = await getCurrentUser();

        const user = await prisma.robot.create({
            data: {
                name,
                description,
                knowledgeBaseName,
                searchEngineName,
                user:{
                    create:{
                        name,
                        email: "robot" +  now().toString().slice(-6) + "@ai.com",
                        isRobot:true,
                        robotOwnerId: ownerUserId? ownerUserId: currentUser?.id,
                        image: "/images/robotbaby.jpg",
                        expiredAt: null,
                    }
                },
                robotTemp:{
                    connect:{
                        id: robotTmpl.id,
                    }
                },
            },
            include:{
                user: true,
                robotTemp: true,
            }
        });

        return NextResponse.json(user);
    } catch(error:any){
        console.log(error,"REGISTRATION_ERROE!");
        return new NextResponse('Internal Error',{status: 500});
    }
}