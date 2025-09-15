-- CreateTable
CREATE TABLE "public"."p2ptransaction" (
    "id" SERIAL NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "fromUserId" INTEGER NOT NULL,

    CONSTRAINT "p2ptransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."p2ptransaction" ADD CONSTRAINT "p2ptransaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."p2ptransaction" ADD CONSTRAINT "p2ptransaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
