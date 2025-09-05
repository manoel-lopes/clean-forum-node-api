/*
  Warnings:

  - You are about to drop the column `pendingUserName` on the `email_validations` table. All the data in the column will be lost.
  - You are about to drop the column `pendingUserPassword` on the `email_validations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."email_validations" DROP COLUMN "pendingUserName",
DROP COLUMN "pendingUserPassword";

-- CreateIndex
CREATE INDEX "Comment_questionId_idx" ON "public"."Comment"("questionId");

-- CreateIndex
CREATE INDEX "Comment_answerId_idx" ON "public"."Comment"("answerId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "public"."Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "public"."Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_questionId_createdAt_idx" ON "public"."Comment"("questionId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_answerId_createdAt_idx" ON "public"."Comment"("answerId", "createdAt");

-- CreateIndex
CREATE INDEX "answers_questionId_idx" ON "public"."answers"("questionId");

-- CreateIndex
CREATE INDEX "answers_authorId_idx" ON "public"."answers"("authorId");

-- CreateIndex
CREATE INDEX "answers_createdAt_idx" ON "public"."answers"("createdAt");

-- CreateIndex
CREATE INDEX "answers_questionId_createdAt_idx" ON "public"."answers"("questionId", "createdAt");

-- CreateIndex
CREATE INDEX "email_validations_email_idx" ON "public"."email_validations"("email");

-- CreateIndex
CREATE INDEX "email_validations_createdAt_idx" ON "public"."email_validations"("createdAt");

-- CreateIndex
CREATE INDEX "questions_authorId_idx" ON "public"."questions"("authorId");

-- CreateIndex
CREATE INDEX "questions_createdAt_idx" ON "public"."questions"("createdAt");

-- CreateIndex
CREATE INDEX "questions_slug_idx" ON "public"."questions"("slug");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "public"."refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "public"."refresh_tokens"("expiresAt");
