import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getKnowledgeFileList from "@/app/actions/LLM/getKnowledgeFileList";

export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();

        const {
            knowledgeId,
        } = body;

        //Get knowledge data via knowledgeId
        const knowledge = await prisma.knowledge.findUnique({
            where: {
                id: knowledgeId,
            },
        });

        if (!knowledge) {
            return new NextResponse('Invalid knowledge ID', { status: 400 });
        };

        const fileList = await getKnowledgeFileList(knowledge?.realName);

        return NextResponse.json(fileList);
    } catch (error) {
        return NextResponse.json(null);
    }
}