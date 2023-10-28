import getCurrentUser from "./getCurrentUser";
import { User } from "@prisma/client";
import prisma from "@/app/libs/prismadb";
import axios from "axios";

const getRobotAnswer = async (
    robotUserId: string | undefined,
    message: string
) => {

    try {
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return "";
        }

        const robotUserFull = await prisma.user.findMany({
            where: {
                id: robotUserId,
            },
            include:{
                robot: {
                    include:{
                        robotTemp: true
                    }
                }
            }
        });

        let reply: string ="";
        
        if (robotUserFull[0].robot) {
            await axios.post(robotUserFull[0].robot?.robotTemp.apiUrl, {
                "model": "chatglm2-6b",
                "messages": [
                  {
                    "role": "user",
                    "content": message
                  }
                ],
                "temperature": 0.7,
                "n": 1,
                "max_tokens": 1024,
                "stop": [],
                "stream": false,
                "presence_penalty": 0,
                "frequency_penalty": 0
            }).then((callback) => {
                reply = callback.data;
            })
        }

        return reply;

    } catch (error: any) {
        return "";
    }
};

export default getRobotAnswer;