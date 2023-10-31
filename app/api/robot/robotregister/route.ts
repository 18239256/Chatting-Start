import bcrypt from "bcryptjs";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  request: Request
) {
    try{
        const body = await request.json();
        
        const {
            name,
            robotTmpls,
        } = body;

        if(!name || !robotTmpls){
            return new NextResponse('Missing info',{status: 400});
        }
        // 密码与机器人的名字相同
        // const hashedPassword = await bcrypt.hash(name, 12);

        const currentUser = await getCurrentUser();

        const user = await prisma.robot.create({
            data: {
                name,
                user:{
                    create:{
                        name,
                        email: name + "@ai.com",
                        isRobot:true,
                        robotOwnerId: currentUser?.id,
                        image: "/images/robotbaby.jpg",
                    }
                },
                robotTemp:{
                    connect:{
                        id: robotTmpls[0].value,
                    }
                }
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