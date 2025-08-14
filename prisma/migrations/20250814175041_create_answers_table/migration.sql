-- CreateTable
CREATE TABLE "public"."answers" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
