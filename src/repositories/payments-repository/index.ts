import { prisma } from "@/config";
import { PaymentProcess } from "@/protocols";

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

async function createPayment(payment: PaymentProcess, ticketTypeId: number) {
  const value = (await prisma.ticketType.findUnique({
    where: { id: ticketTypeId }
  })).price;

  return prisma.payment.create({
    data: {
      ticketId: payment.ticketId,
      cardIssuer: payment.cardData.issuer, 
      cardLastDigits: payment.cardData.number,
      value
    }
  });
}

async function updateTicket(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId
    },
    data: {
      status: "PAID"
    }
  });
}

async function findEnrollmentByUserId(userId: number) { //duplicada no tickets repository
  return prisma.enrollment.findUnique({
    where: { userId }
  });
}

const paymentsRepository = {
  findPaymentById,
  findTicketById,
  createPayment,
  updateTicket,
  findEnrollmentByUserId
};

export default paymentsRepository;
