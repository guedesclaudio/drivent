import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { Enrollment, Ticket, TicketType } from "@prisma/client";

async function getTicketsTypesToEvent(): Promise<TicketType[]> {
  return ticketsRepository.findTicketsTypesToEvent();
}

async function getTicketsToEvent(userId: number): Promise<Ticket> {
  const enrollmentId = (await getEnrollmentByUserId(Number(userId))).id; 
  const ticket = await ticketsRepository.findTicketsToEvent(enrollmentId);

  if (!ticket.enrollmentId) {
    throw notFoundError();
  }

  return ticket;
}

async function postTicketToEvent(ticketTypeId: number, userId: number) {
  const enrollment = await getEnrollmentByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  return ticketsRepository.createTicketToEvent(ticketTypeId, enrollment.id);
}

async function getEnrollmentByUserId(userId: number): Promise<Enrollment> {
  return ticketsRepository.findEnrollmentByUserId(userId);
}

const ticketsService = {
  getTicketsTypesToEvent,
  getTicketsToEvent,
  postTicketToEvent,
  getEnrollmentByUserId
};

export default ticketsService;
