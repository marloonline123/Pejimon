import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import prisma from "../src/lib/prismaClient.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ordered file names: dependencies must be created before dependents
const orderedFileNames = [
  "user.json",
  "account.json",
  "plan.json",
  "organization.json",
  "organizationRole.json",
  "member.json",
  "invitation.json",
  "subscription.json",
  "team.json",
  "teamUser.json",
  "project.json",
  "projectTeam.json",
  "projectUser.json",
  "milestone.json",
  "task.json",
  "taskAssignment.json",
  "taskDependency.json",
  "comment.json",
  "attachment.json",
  "timeEntry.json",
  "client.json",
  "projectClient.json",
  "clientApproval.json",
  "conversation.json",
  "conversationMember.json",
  "message.json",
  "notification.json",
  "activity.json",
  "projectTemplate.json",
  "templateMilestone.json",
  "templateTask.json",
];

async function deleteAllData(fileNames: string[]) {
  console.log("🧹 Clearing old data...");
  const reversed = [...fileNames].reverse();

  for (const fileName of reversed) {
    const modelName = path.basename(fileName, path.extname(fileName));
    const model = (prisma as Record<string, any>)[modelName];

    if (model && typeof model.deleteMany === "function") {
      try {
        await model.deleteMany({});
        console.log(`   Cleared data from ${modelName}`);
      } catch (error) {
        console.error(`   Error clearing data from ${modelName}:`, error);
      }
    }
  }
}

async function seedAllData(fileNames: string[]) {
  const dataDirectory = path.join(__dirname, "seedData");
  console.log("🌱 Seeding new data from JSON files...");

  for (const fileName of fileNames) {
    const filePath = path.join(dataDirectory, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      continue;
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);
    const modelName = path.basename(fileName, path.extname(fileName));
    const model = (prisma as Record<string, any>)[modelName];

    if (!model || typeof model.create !== "function") {
      console.warn(`⚠️ Prisma model not found for: ${modelName}`);
      continue;
    }

    try {
      for (const item of jsonData) {
        await model.create({ data: item });
      }
      console.log(
        `   ✅ Seeded ${modelName} (${jsonData.length} records) from ${fileName}`,
      );
    } catch (error) {
      console.error(`   ❌ Error seeding ${modelName}:`, error);
      throw error;
    }
  }
}

async function main() {
  await deleteAllData(orderedFileNames);
  await seedAllData(orderedFileNames);
  console.log("\n✨ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
