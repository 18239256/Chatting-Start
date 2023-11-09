import prisma from "@/app/libs/prismadb";

export default async function getKnowledgesByUserId(userId: string) {
  const knowledges = await prisma.knowledge.findMany({
    where: {
      userId: userId
    }
  });
  return knowledges;
}