import { AuthenticatedRequest } from "@/middlewares";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export function validateBodyTicketType(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketTypeId } = req.body;
  const { userId } = req;

  if (!ticketTypeId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  req.userId = userId;
  next();
}
