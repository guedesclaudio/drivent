import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

export async function createHotel(): Promise<Hotel> {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    }
  });
}

export async function createRoom(hotelId: number): Promise<Room> {
  return prisma.room.create({
    data: 
    {
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId  
    }
  });
}

export async function createBooking(roomId: number, userId: number, hotelId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}
