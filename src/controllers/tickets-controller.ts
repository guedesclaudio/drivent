import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import ticketsService from "@/services/tickets-service";

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getTicketsTypesToEvent();

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT); //verificar se ta correto
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const tickets = await ticketsService.getTicketsToEvent();

    if (!tickets.enrollmentId) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND); //verificar se ta correto
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const { userId } = req;

  if (!ticketTypeId) {
    return res.sendStatus(httpStatus.BAD_REQUEST); // verificar se ta correto
  }

  try {
    const enrollment = await ticketsService.getEnrollmentByUserId(Number(userId));

    if (!enrollment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const ticket = await ticketsService.postTicketToEvent(Number(ticketTypeId), Number(enrollment.id));

    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND); //verificar se ta correto
  }
}
