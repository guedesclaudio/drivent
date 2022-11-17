import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";

async function findTicketsTypesToEvent() {
  return prisma.ticketType.findMany();
}

async function findTicketsToEvent() {
  return prisma.ticket.findMany();
}

async function createTicketToEvent(ticketTypeId: number) {
  //return prisma.ti
}

const ticketsRepository = {
  findTicketsTypesToEvent,
  findTicketsToEvent,
  createTicketToEvent
};

export default ticketsRepository;
