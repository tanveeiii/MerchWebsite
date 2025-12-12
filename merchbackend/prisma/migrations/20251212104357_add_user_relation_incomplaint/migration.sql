-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
