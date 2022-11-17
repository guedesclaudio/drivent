import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketsTypesToEvent() {
  const result = await ticketsRepository.findTicketsTypesToEvent();

  return result;
}

async function getTicketsToEvent() {
  const result = await ticketsRepository.findTicketsToEvent();

  if (!result) {
    throw notFoundError();
  }
  return result;
}

async function postTicketToEvent(ticketTypeId: number) {
  return ticketsRepository.createTicketToEvent(ticketTypeId);
}

const ticketsService = {
  getTicketsTypesToEvent,
  getTicketsToEvent,
  postTicketToEvent
};

export default ticketsService;
