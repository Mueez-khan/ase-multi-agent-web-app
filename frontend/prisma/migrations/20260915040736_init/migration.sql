-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Ai');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
