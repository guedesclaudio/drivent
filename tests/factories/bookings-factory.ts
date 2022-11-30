import { prisma } from "@/config";

export async function createBookingWithUserId(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

export async function findBookingWithRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: { roomId }
  });
}

export async function updateBookingWithRoomId(roomId: number, bookingId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { roomId }
  });
}

export async function findBookingUpdated(roomId: number) {
  return prisma.booking.findFirst({
    where: { roomId }
  });
}
