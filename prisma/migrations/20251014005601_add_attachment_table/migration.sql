-- CreateTable
CREATE TABLE "public"."attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "questionId" TEXT,
    "answerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attachments_questionId_idx" ON "public"."attachments"("questionId");

-- CreateIndex
CREATE INDEX "attachments_answerId_idx" ON "public"."attachments"("answerId");

-- CreateIndex
CREATE INDEX "attachments_createdAt_idx" ON "public"."attachments"("createdAt");

-- CreateIndex
CREATE INDEX "attachments_questionId_createdAt_idx" ON "public"."attachments"("questionId", "createdAt");

-- CreateIndex
CREATE INDEX "attachments_answerId_createdAt_idx" ON "public"."attachments"("answerId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
