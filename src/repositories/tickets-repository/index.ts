import { prisma } from "@/config";

async function findTicketsTypesToEvent() {
  return prisma.ticketType.findMany();
}

async function findTicketsToEvent() {
  return prisma.ticket.findFirst();
}

async function createTicketToEvent(ticketTypeId: number) {
  /*const Ticket = await prisma.ticket.create({
    data: {
      ticketTypeId
    }
  })*/

  /*
  return prisma.ticket.findUnique({
    where: {ticketTypeId}
  });*/
}

const ticketsRepository = {
  findTicketsTypesToEvent,
  findTicketsToEvent,
  createTicketToEvent
};

export default ticketsRepository;
