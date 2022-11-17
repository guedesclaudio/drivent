import { prisma } from "@/config";

async function findTicketsTypesToEvent() {
  return prisma.ticketType.findMany();
}

async function findTicketsToEvent() {
  return prisma.ticket.findMany();
}

async function createTicketToEvent(ticketTypeId: number) {
  return prisma.ticket.upsert({
    where: {
      ticketTypeId,
    },
  });
}

const ticketsRepository = {
  findTicketsTypesToEvent,
  findTicketsToEvent,
  createTicketToEvent
};

export default ticketsRepository;
