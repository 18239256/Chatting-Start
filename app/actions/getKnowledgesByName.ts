import prisma from "@/app/libs/prismadb";

export default async function getKnowledgesByName(knowledgeRealName: string) {
  const knowledge = await prisma.knowledge.findUnique({
    where: {
        realName: knowledgeRealName
    }
  });
  return knowledge;
}