import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";

async function getTicketsTypesToEvent() {
  const result = await ticketsRepository.findTicketsTypesToEvent();

  return result;
}

async function getTicketsToEvent() {
  const ticket = await ticketsRepository.findTicketsToEvent();
  const ticketType = (await ticketsRepository.findTicketsTypesToEvent())[0];

  const {
    createdAt,
    id,
    includesHotel,
    isRemote,
    name,
    price,
    updatedAt
  } = ticketType;

  const result = {
    ...ticket,
    TicketType: {
      createdAt,
      id,
      includesHotel,
      isRemote,
      name,
      price,
      updatedAt
    }
  };

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
