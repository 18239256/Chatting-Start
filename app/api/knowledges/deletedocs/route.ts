import { NextResponse } from "next/server";

import delKnowledgeFiles from "@/app/actions/LLM/delKnowledgeFiles";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
        knowledgeBaseName,
        file_names
    } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ret = await delKnowledgeFiles(knowledgeBaseName, file_names);

    return NextResponse.json(ret);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES')
    return new NextResponse('Error', { status: 500 });
  }
}