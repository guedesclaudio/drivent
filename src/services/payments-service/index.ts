import { PaymentProcess } from "@/protocols";
import paymentsRepository from "@/repositories/payments-repository";

async function getPaymentById(ticketId: number) {
  const result = await paymentsRepository.findPaymentById(ticketId);
  return result;
}

async function getTicketById(ticketId: number) {
  const result = await paymentsRepository.findTicketById(ticketId);
  return result;
}

async function postPayment(payment: PaymentProcess) {
  //return paymentsRepository.createPayment(payment);
}

const paymentsService = {
  getPaymentById,
  getTicketById,
  postPayment
};

export default paymentsService;
