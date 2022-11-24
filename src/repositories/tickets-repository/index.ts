import { prisma } from "@/config";

async function findTicketsTypesToEvent() {
  return prisma.ticketType.findMany();
}

async function findTicketsToEvent(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true }
  }); 
}

async function findEnrollmentByUserId(userId: number) {
  return prisma.enrollment.findUnique({
    where: {
      userId
    }
  });
}

async function createTicketToEvent(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: "RESERVED"
    },
    include: { TicketType: true }
  });
}

async function findTiketTypeById(ticketTypeId: number) {
  return prisma.ticketType.findUnique({
    where: { id: ticketTypeId }
  });
}

const ticketsRepository = {
  findTicketsTypesToEvent,
  findTicketsToEvent,
  createTicketToEvent,
  findEnrollmentByUserId,
  findTiketTypeById
};

export default ticketsRepository;
