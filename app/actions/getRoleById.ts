import prisma from "@/app/libs/prismadb";

export default async function getRoleById(roleId: string) {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId
    }
  });
  return role;
}