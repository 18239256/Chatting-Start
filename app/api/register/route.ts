import bcrypt from "bcryptjs";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
    try{
        const body = await request.json();
        
        const {
            email,
            name,
            password
        } = body;

        if(!email || !name || !password){
            return new NextResponse('Missing info',{status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const defaultRoles = await prisma.role.findMany({
            where:{
                defaultRole: true,
            }

        });

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
                isRobot: false,
                assignRole: {
                    connect: defaultRoles.map((role) => ({ id: role.id })),
                }
            }
        });

        return NextResponse.json(user);
    } catch(error:any){
        console.log(error,"REGISTRATION_ERROE!");
        return new NextResponse('Internal Error',{status: 500});
    }
}