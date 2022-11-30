import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true }
  });
}

async function insertBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    },
    select: { id: true }
  });
}

async function putBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      roomId
    },
    select: { id: true }
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findUnique({
    where: { id: roomId }
  });
}

async function findBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId }
  });
}

async function findBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: { roomId }
  });
}

async function findBookingById(bookingId: number) {
  return prisma.booking.findUnique({
    where: { id: bookingId }
  });
}

const bookingsRepository = {
  findBookingByUserId,
  insertBooking,
  putBooking,
  findRoomById,
  findBookingsByRoomId,
  findBookingByRoomId,
  findBookingById
};

export default bookingsRepository;
