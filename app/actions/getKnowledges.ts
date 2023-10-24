import prisma from "@/app/libs/prismadb";

export default async function getKnowledges() {

  const knowledges = await prisma.knowledge.findMany();
    return knowledges;
  }