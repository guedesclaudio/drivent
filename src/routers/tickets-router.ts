import { Router } from "express";
import { authenticateToken, validateBodyTicketType } from "@/middlewares";
import { getTicketsTypes, getTickets, postTicket } from "@/controllers/tickets-controller";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketsTypes)
  .get("/", getTickets)
  .post("/", validateBodyTicketType, postTicket);

export { ticketsRouter };
