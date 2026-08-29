/*
  Warnings:

  - The primary key for the `team_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[organization_id,user_id,team_id]` on the table `team_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organization_id` to the `team_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "team_user" DROP CONSTRAINT "team_user_pkey",
ADD COLUMN     "organization_id" TEXT NOT NULL,
ADD CONSTRAINT "team_user_pkey" PRIMARY KEY ("organization_id", "user_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_user_organization_id_user_id_team_id_key" ON "team_user"("organization_id", "user_id", "team_id");

-- AddForeignKey
ALTER TABLE "team_user" ADD CONSTRAINT "team_user_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
