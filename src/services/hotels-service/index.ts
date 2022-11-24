import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Hotel, Room, TicketStatus } from "@prisma/client";

async function getHotels(userId: number): Promise<Hotel[] | []> {
  const conditionsIsValid  = await verifyEnrollmentAndTicketByUserId(userId);

  if (!conditionsIsValid) {
    return [];
  }

  return hotelsRepository.findHotels();
}

async function getRoomsPerHotelById(hotelId: number, userId: number): Promise<Room[] | boolean> {
  const conditionsIsValid = await verifyEnrollmentAndTicketByUserId(userId);

  if (!conditionsIsValid) {
    return false;
  }

  const hotel = await hotelsRepository.findHotelById(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  return hotelsRepository.findRoomsPerHotelById(hotelId);
}

async function verifyEnrollmentAndTicketByUserId(userId: number): Promise<boolean> {
  const enrollment = await ticketsRepository.findEnrollmentByUserId(userId);

  if (!enrollment) {
    return false;
  }

  const ticket = await ticketsRepository.findTicketsToEvent(enrollment.id);

  if (!ticket || ticket.status !== TicketStatus.PAID) {
    return false;
  }
  
  const ticketType = await ticketsRepository.findTiketTypeById(ticket.ticketTypeId);

  //verificar se tem um payment com o tickeId

  if (ticketType.includesHotel === false || ticketType.isRemote === true) {
    return false;
  }

  return true;
}

const hotelsService = {
  getHotels,
  getRoomsPerHotelById
};

export default hotelsService;
