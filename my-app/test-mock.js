const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  console.log('PrismaClient created');
  const users = await prisma.user.findMany();
  console.log('Users:', users.length);
  await prisma.$disconnect();
  console.log('OK');
}
main().catch(e => console.error(e));
