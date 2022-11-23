import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsPerHotelById(hotelId: number) {
  return prisma.room.findMany({
    where: { hotelId }
  });
}

async function findBookings() {
  return prisma.booking.findMany();
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findUnique({
    where: { id: hotelId }
  });
}

const hotelsRepository = {
  findHotels,
  findRoomsPerHotelById,
  findHotelById,
  findBookings
};

export default hotelsRepository;
