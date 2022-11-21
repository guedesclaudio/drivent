import { PaymentProcess } from "@/protocols";
import paymentsRepository from "@/repositories/payments-repository";
import { Payment, Ticket } from "@prisma/client";

let ticket: Ticket;

async function getPaymentById(ticketId: number): Promise<Payment> {
  const result = await paymentsRepository.findPaymentById(ticketId);
  return result;
}

async function getTicketById(ticketId: number): Promise<Ticket> {
  ticket = await paymentsRepository.findTicketById(ticketId);
  return ticket;
}

async function postPayment(payment: PaymentProcess): Promise<Payment> {
  const result = await paymentsRepository.createPayment(payment, ticket.ticketTypeId);
  await paymentsRepository.updateTicket(Number(payment.ticketId));

  return {
    ...result,
    cardLastDigits: result.cardLastDigits.slice(-4)
  };
}

const paymentsService = {
  getPaymentById,
  getTicketById,
  postPayment
};

export default paymentsService;
