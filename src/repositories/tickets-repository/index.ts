import { prisma } from "@/config";

async function findTicketsTypesToEvent() {
  return prisma.ticketType.findMany();
}

async function findTicketsToEvent() {
  return prisma.ticket.findFirst();
}

async function findEnrollmentByUserId(userId: number) {
  return prisma.enrollment.findUnique({
    where: {
      userId
    }
  });
}

async function createTicketToEvent(ticketTypeId: number, enrollmentId: number) {
  const ticket = await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED"
    }
  });

  const ticketType = await prisma.ticketType.findUnique({
    where: { id: ticketTypeId }
  });
  
  return { ticket, ticketType };
}

const ticketsRepository = {
  findTicketsTypesToEvent,
  findTicketsToEvent,
  createTicketToEvent,
  findEnrollmentByUserId
};

export default ticketsRepository;
