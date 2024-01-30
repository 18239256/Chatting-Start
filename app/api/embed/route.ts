import { NextResponse } from "next/server";
import getRobotAnswerBase from "@/app/actions/getRobotAnswerBase";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();
    const {
      robot,
      message,
    } = body;

    const retMessage = await getRobotAnswerBase(robot, message);

    return NextResponse.json(retMessage)
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}