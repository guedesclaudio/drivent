import { prisma } from "@/config";
import { PaymentProcess } from "@/protocols";
import { Enrollment } from "@prisma/client";

async function findPaymentById(ticketId: number) {
  return prisma.payment.findFirst({
    where: { 
      ticketId 
    },
  });
}

async function findTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: { 
      id: ticketId
    },
  });
}

async function createPayment(payment: PaymentProcess) {
  /*return prisma.payment.create({
    data: {
      ticketId: payment.ticketId,
      cardIssuer: payment.cardData.issuer, 
      cardLastDigits: payment.cardData.number
    }
  });*/
}

const paymentsRepository = {
  findPaymentById,
  findTicketById
};

export default paymentsRepository;
