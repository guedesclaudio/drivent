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

  const rooms =  await hotelsRepository.findRoomsPerHotelById(hotelId);
  const bookings = await hotelsRepository.findBookings();
  const availableRooms: Room[] = [];

  if (bookings.length === 0) {
    return rooms;
  }

  rooms.map(value => {
    bookings.filter(element => {
      if (value.id !== element.roomId) {
        availableRooms.push(value);
      }
    });
  });

  return availableRooms;
}

const hotelsService = {
  getHotels,
  getRoomsPerHotelById
};

export default hotelsService;
