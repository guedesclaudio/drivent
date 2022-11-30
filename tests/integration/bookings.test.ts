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
    it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const token = await generateValidToken(); 
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user doesnt have an ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(); 
      await createEnrollmentWithAddress(user);
      await createTicketTypeCorrect();
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user have an incorrect ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user doesnt have an payment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when there are no Booking created", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);
    
      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
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
      console.log(response.body);
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
      }); //TODO - especificar o retorno
    });
  });
});
