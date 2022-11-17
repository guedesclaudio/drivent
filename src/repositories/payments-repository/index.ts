import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";

async function findPaymentById(ticketId: number) {
  return prisma.payment.findFirst({
    where: { 
      ticketId 
    },
  });
}

const paymentsRepository = {
  findPaymentById
};

export default paymentsRepository;
