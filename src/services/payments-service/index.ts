import { PaymentProcess } from "@/protocols";
import paymentsRepository from "@/repositories/payments-repository";
import { Ticket } from "@prisma/client";

let ticket: Ticket;

async function getPaymentById(ticketId: number) {
  const result = await paymentsRepository.findPaymentById(ticketId);
  return result;
}

async function getTicketById(ticketId: number) {
  ticket = await paymentsRepository.findTicketById(ticketId);
  return ticket;
}

async function postPayment(payment: PaymentProcess) {
  const result = await paymentsRepository.createPayment(payment, ticket.ticketTypeId);
  await paymentsRepository.updateTicket(Number(payment.ticketId));

  return {
    ...result,
    cardLastDigits: result.cardLastDigits.slice(-4)
  };
}

async function getEnrollmentByUserId(userId: number) {
  return paymentsRepository.findEnrollmentByUserId(userId);
}

const paymentsService = {
  getPaymentById,
  getTicketById,
  postPayment,
  getEnrollmentByUserId
};

export default paymentsService;
