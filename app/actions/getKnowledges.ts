import prisma from "@/app/libs/prismadb";

export default async function getKnowledges(userId: string) {
  const knowledges = await prisma.knowledge.findMany({
    where: {
      userId: userId
    }
  });
  return knowledges;
}