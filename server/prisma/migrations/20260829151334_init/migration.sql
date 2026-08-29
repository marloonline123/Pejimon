/*
  Warnings:

  - You are about to drop the `team_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "team_user" DROP CONSTRAINT "team_user_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "team_user" DROP CONSTRAINT "team_user_team_id_fkey";

-- DropForeignKey
ALTER TABLE "team_user" DROP CONSTRAINT "team_user_user_id_fkey";

-- DropTable
DROP TABLE "team_user";

-- CreateTable
CREATE TABLE "team_member" (
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "membershipKey" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("organization_id","user_id","team_id")
);

-- CreateIndex
CREATE INDEX "team_member_user_id_idx" ON "team_member"("user_id");

-- CreateIndex
CREATE INDEX "team_member_team_id_idx" ON "team_member"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_member_organization_id_user_id_team_id_key" ON "team_member"("organization_id", "user_id", "team_id");

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
