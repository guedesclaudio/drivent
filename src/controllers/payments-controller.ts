import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import paymentsService from "@/services/payments-service";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;
  console.log(ticketId);

  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST); //verificar
  }

  try {
    const payment = await paymentsService.getPaymentById(Number(ticketId));

    if (payment.ticketId) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
        
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT); //VERIFICAR
  }
}

