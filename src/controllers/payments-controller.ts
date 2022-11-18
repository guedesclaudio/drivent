import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import paymentsService from "@/services/payments-service";
import { PaymentProcess } from "@/protocols";

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;

  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST); //verificar
  }

  try {
    const ticket = await paymentsService.getTicketById(Number(ticketId));

    if (!ticket) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const payment = await paymentsService.getPaymentById(Number(ticketId));

    if (!payment.ticketId) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
        
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED); //VERIFICAR
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const payment = req.body as PaymentProcess;
  const { userId } = req;

  if (!payment.cardData || !payment.ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const enrollment = await paymentsService.getEnrollmentByUserId(Number(userId));
    const ticket = await paymentsService.getTicketById(Number(payment.ticketId));

    if (!ticket) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(enrollment?.id !== ticket.enrollmentId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    const result = await paymentsService.postPayment(payment);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED); //VERIFICAR
  }
}
