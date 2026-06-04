// 测试脚本 - 验证项目基本功能
const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // 测试查询
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);
    
    const profiles = await prisma.profile.findMany();
    console.log(`Found ${profiles.length} profiles`);
    
    const projects = await prisma.project.findMany();
    console.log(`Found ${projects.length} projects`);
    
    const diaries = await prisma.diary.findMany();
    console.log(`Found ${diaries.length} diaries`);
    
    const musicTracks = await prisma.musicTrack.findMany();
    console.log(`Found ${musicTracks.length} music tracks`);
    
    const githubRepos = await prisma.gitHubRepo.findMany();
    console.log(`Found ${githubRepos.length} GitHub repos`);
    
    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
