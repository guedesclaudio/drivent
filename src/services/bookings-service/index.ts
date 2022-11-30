import bookingsRepository from "@/repositories/bookings-repository";
import { notFoundError } from "@/errors";
import ticketsRepository from "@/repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";
import { exclude } from "@/utils/prisma-utils";
import { forbiddenError } from "@/errors/forbidden-error";
import { ReadBooking } from "@/protocols";
import { Room, Booking } from "@prisma/client";

async function getBookingByUserId(userId: number) {
  const booking = await bookingsRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return exclude(booking, "createdAt", "updatedAt", "roomId", "userId");
}

async function postBooking(userId: number, roomId: number) {
  const conditionsIsValid = await verifyConditions(userId);
  
  if (!conditionsIsValid) {
    throw notFoundError();
  }

  const roomIsCheck = await verifyRoomAndBooking(roomId);
  
  if (roomIsCheck === "RoomNotFound") {
    throw notFoundError();
  }
  if (roomIsCheck === "RoomIsFull") {
    throw forbiddenError();
  }

  return bookingsRepository.insertBooking(userId, roomId);
}

async function updateBooking(bookingId: number, roomId: number, userId: number) {
  const conditionsIsValid = await verifyConditions(userId);
  
  if (!conditionsIsValid) {
    throw notFoundError();
  }

  const roomIsCheck = await verifyRoomAndBooking(roomId);
  
  if (roomIsCheck === "RoomNotFound") {
    throw notFoundError();
  }
  if (roomIsCheck === "RoomIsFull") {
    throw forbiddenError();
  }

  const booking = await bookingsRepository.findBookingById(bookingId);
  
  if (!booking || booking.userId !== userId) {
    throw notFoundError();
  }

  return bookingsRepository.putBooking(bookingId, roomId);
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

async function verifyRoomAndBooking(roomId: number): Promise<string | boolean> {
  const room = await bookingsRepository.findRoomById(roomId);

  if (!room) {
    return "RoomNotFound";
  }

  const { capacity } = room;
  const amountBookings = (await bookingsRepository.findBookingsByRoomId(roomId)).length;

  if (capacity === amountBookings) {
    return "RoomIsFull";
  }

  return true;
}

const bookingsService = {
  getBookingByUserId,
  postBooking,
  updateBooking
};

export default bookingsService;
