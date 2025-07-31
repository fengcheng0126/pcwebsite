import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Change the criteria below to match the 3rd user (e.g., by email, id, or name)
  await prisma.user.delete({
    where: { email: 'test001@gmail.com' } // <-- Replace with actual email or use id
  });
  console.log('3rd user deleted!');
}

main().finally(() => prisma.$disconnect());
