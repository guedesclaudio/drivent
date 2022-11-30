import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createBookingWithUserId(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}
