import bookingsRepository from "@/repositories/bookings-repository";
import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";

async function getBookingByUserId(userId: number) {
  const conditionsIsValid = await verifyConditions(userId);
  
  if (!conditionsIsValid) {
    throw notFoundError();
  }

  const booking = await bookingsRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return exclude(booking, "createdAt", "updatedAt", "roomId", "userId");
}

async function postBooking(userId: number, roomId: number) {
  return bookingsRepository.insertBooking(userId, roomId);

  //TODO - verificar se o roomId existe -> 404
  //TODO - verificar se tem vaga nesse roomId -> 403
}

async function updateBooking(bookingId: number, roomId: number) {
  return bookingsRepository.putBooking(bookingId, roomId);

  //TODO - verificar se o roomId existe -> 404
  //TODO - verificar se tem vaga nesse roomId -> 403
}

async function verifyConditions(userId: number): Promise<boolean> {
  const enrollment = await ticketsRepository.findEnrollmentByUserId(userId);
  
  if (!enrollment) {
    return false;
  }
  
  const ticket = await ticketsRepository.findTicketsToEvent(enrollment.id);
  
  if (!ticket || ticket.status !== TicketStatus.PAID) {
    return false;
  }
    
  const ticketType = await ticketsRepository.findTiketTypeById(ticket.ticketTypeId);
  
  if (ticketType.includesHotel === false || ticketType.isRemote === true) {
    return false;
  }
  
  return true;
}

const bookingsService = {
  getBookingByUserId,
  postBooking,
  updateBooking
};

export default bookingsService;
