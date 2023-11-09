import prisma from "@/app/libs/prismadb";

export default async function getKnowledgesById(knowledgeId: string) {
  const knowledge = await prisma.knowledge.findUnique({
    where: {
      id: knowledgeId
    }
  });
  return knowledge;
}