import httpStatus from "http-status";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import app, { init } from "@/app";
import faker from "@faker-js/faker";
import * as jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";
import { 
  createUser, 
  createHotel, 
  createRoom, 
  createTicket, 
  createTicketTypeIncorrect, 
  createEnrollmentWithAddress, 
  createPayment, 
  updateTicket, 
  createTicketTypeCorrect, 
  createBookingWithUserId,
  findBookingWithRoomId,
  findBookingUpdated

} from "../factories";

beforeAll(async () => {
  await init();
});
    
beforeEach(async () => {
  await cleanDb();
});
  
const server = supertest(app);

describe("GET /booking", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/booking");
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
        
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
        
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when there are no Booking created", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 200 and with existing Booking data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      const booking = await createBookingWithUserId(user.id, room.id);
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          capacity: room.capacity,
          hotelId: room.hotelId,
          name: room.name,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        }
      });
    });
  });
});

describe("POST /booking", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.post("/booking");
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
        
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
        
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if body roomId is missing", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if body roomId is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: "a" });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const token = await generateValidToken(); 
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user doesnt have an ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      await createEnrollmentWithAddress(user);
      await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user have an incorrect ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user doesnt have an payment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 400 when roomId is invalid partition", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: 0 });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when roomId doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: 9999999 });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when room is full", async () => {
      const user = await createUser();
      const anotherUser = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      await createBookingWithUserId(anotherUser.id, room.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 when user already has booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      await createBookingWithUserId(user.id, room.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    
    it("should respond with status 200 and create Booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
    
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      const bookingCreated = await findBookingWithRoomId(room.id);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ id: bookingCreated.id });
    });
  });
});

describe("UPDATE /booking", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.put("/booking");
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
        
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();
    
      const response = await server.put("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
        
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
      const response = await server.put("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 400 if body roomId is missing", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBookingWithUserId(user.id, room.id);

      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if body roomId is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBookingWithUserId(user.id, room.id);

      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: "a" });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 if bookinId is not a number", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBookingWithUserId(user.id, room.id);

      const response = await server.put("/booking/a").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const token = await generateValidToken(); 
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user doesnt have an ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      await createEnrollmentWithAddress(user);
      await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBookingWithUserId(user.id, room.id);

      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user have an incorrect ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBookingWithUserId(user.id, room.id);
    
      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user doesnt have an payment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBookingWithUserId(user.id, room.id);
    
      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 400 when roomId is invalid partition", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      const booking = await createBookingWithUserId(user.id, room.id);
    
      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: 0 });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when roomId doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      const booking = await createBookingWithUserId(user.id, room.id);
    
      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: 9999999 });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 400 when bookingId is invalid partition", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
    
      const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when bookingId doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
    
      const response = await server.put("/booking/9999999").set("Authorization", `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when room is full", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      const booking = await createBookingWithUserId(user.id, room.id);
      const newRoom = await createRoom(hotel.id);
      await createBookingWithUserId(user.id, newRoom.id);
    
      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: newRoom.id });
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    
    it("should respond with status 200 and update Booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
      const booking = await createBookingWithUserId(user.id, room.id);
      const newRoom = await createRoom(hotel.id);
  
      const response = await server.put(`/booking/${booking.id}`).set("Authorization", `Bearer ${token}`).send({ roomId: newRoom.id });
      const bookingUpdated = await findBookingUpdated(newRoom.id);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ id: bookingUpdated.id });
    });
  });
});
