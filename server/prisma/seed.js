import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();
async function deleteAllData(orderedFileNames) {
    const modelNames = orderedFileNames.map((fileName) => {
        const modelName = path.basename(fileName, path.extname(fileName));
        return modelName.charAt(0).toUpperCase() + modelName.slice(1);
    });
    // Reverse the array to delete in reverse order of creation
    for (const modelName of modelNames.reverse()) {
        const model = prisma[modelName];
        try {
            await model.deleteMany({});
            console.log(`Cleared data from ${modelName}`);
        }
        catch (error) {
            console.error(`Error clearing data from ${modelName}:`, error);
        }
    }
}
async function main() {
    const dataDirectory = path.join(__dirname, "seedData");
    // Ordered so that dependencies are created first
    const orderedFileNames = [
        "user.json",
        "team.json",
        "project.json",
        "projectTeam.json",
        "teamUser.json",
        "task.json",
        "attachment.json",
        "comment.json",
        "taskAssignment.json"
    ];
    await deleteAllData(orderedFileNames);
    for (const fileName of orderedFileNames) {
        const filePath = path.join(dataDirectory, fileName);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }
        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const modelName = path.basename(fileName, path.extname(fileName));
        const model = prisma[modelName];
        try {
            for (const data of jsonData) {
                await model.create({ data });
            }
            console.log(`Seeded ${modelName} with data from ${fileName}`);
        }
        catch (error) {
            console.error(`Error seeding data for ${modelName}:`, error);
        }
    }
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=seed.js.map