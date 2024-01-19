import { NextResponse } from "next/server";
import getEmbedRobotAnswer from "@/app/actions/getEmbedRobotAnswer";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();
    const {
      robot,
      message,
    } = body;
    console.log('robot', robot);
    const retMessage = await getEmbedRobotAnswer(robot, message);

    return NextResponse.json(retMessage)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}