import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", users.map(u => u.id));
    
    const teams = await prisma.team.findMany();
    console.log("Teams:", teams.map(t => t.id));
    
    // Also try to read team.json and manually insert to see the error
    const fs = require('fs');
    const path = require('path');
    const teamData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seedData/team.json')));
    
    console.log("Attempting to insert:", teamData[0]);
    await prisma.team.create({ data: teamData[0] });
    console.log("Successfully inserted team 0");
  } catch(err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
