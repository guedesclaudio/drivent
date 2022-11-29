import bookingsRepository from "@/repositories/bookings-repository";

async function getBookingByUserId(userId: number) {
  return bookingsRepository.findBookingByUserId(userId);

  //TODO - verificar se o usuário tem reserva
}

async function postBooking(userId: number, roomId: number) {
  return bookingsRepository.insertBooking(userId, roomId);

  //TODO - verificar se o roomId existe -> 404
  //TODO - verificar se tem vaga nesse roomId -> 403
}

async function updateBooking(bookingId: number, roomId: number) {
  return bookingsRepository.putBooking(bookingId, roomId);

  //TODO - verificar se o roomId existe -> 404
  //TODO - verificar se tem vaga nesse roomId -> 403
}

const bookingsService = {
  getBookingByUserId,
  postBooking,
  updateBooking
};

export default bookingsService;
