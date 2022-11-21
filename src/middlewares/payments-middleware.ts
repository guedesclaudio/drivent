import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authentication-middleware";
import httpStatus from "http-status";
import { PaymentProcess } from "@/protocols";

export function validateBodyTicketId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketId } = req.query;
    
  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  next();
}

export function validateBodyPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const payment = req.body as PaymentProcess;
  const { userId } = req;

  if (!payment.cardData || !payment.ticketId) { //schema
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  req.userId = userId;
  next();
}
