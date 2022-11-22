import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import { Hotel, Room } from "@prisma/client";

async function getHotels(): Promise<Hotel[]> {
  return hotelsRepository.findHotels();
}

async function getRoomsPerHotelById(hotelId: number): Promise<Room[]> {
  const hotel = await hotelsRepository.findHotelById(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  return hotelsRepository.findRoomsPerHotelById(hotelId);
}

const hotelsService = {
  getHotels,
  getRoomsPerHotelById
};

export default hotelsService;
