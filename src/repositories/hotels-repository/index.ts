import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsPerHotelById(hotelId: number) {
  /*return prisma.room.findMany({
    where: { hotelId }, 
    include: { Hotel: {
      select: {
        id: true,
        name: true,
        image: true
      }
    } } 
  });*/

  return prisma.hotel.findUnique({
    where: { id: hotelId }, 
    include: { Rooms: true } 
  });
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findUnique({
    where: { id: hotelId }
  });
}

const hotelsRepository = {
  findHotels,
  findRoomsPerHotelById,
  findHotelById
};

export default hotelsRepository;
