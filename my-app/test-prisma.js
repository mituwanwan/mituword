const { PrismaClient } = require('@prisma/client');

async function main() {
  const p = new PrismaClient();
  try {
    const users = await p.user.findMany();
    console.log('Users:', users.length);
    const projects = await p.project.findMany();
    console.log('Projects:', projects.length);
    console.log('Prisma OK!');
  } catch (e) {
    console.log('Error:', e.message);
  } finally {
    await p.$disconnect();
  }
}
main();
