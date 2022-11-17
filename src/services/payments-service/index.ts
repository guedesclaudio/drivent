import paymentsRepository from "@/repositories/payments-repository";

async function getPaymentById(ticketId: number) {
  const result = await paymentsRepository.findPaymentById(ticketId);
  return result;
}

const paymentsService = {
  getPaymentById
};

export default paymentsService;
