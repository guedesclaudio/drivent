import httpStatus from "http-status";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { createUser, createHotel, createRoom, createTicket, createTicketTypeIncorrect, createEnrollmentWithAddress, createPayment, updateTicket, createTicketTypeCorrect } from "../factories";
import * as jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
  await init();
});
  
beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/hotels");
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const token = await generateValidToken(); 

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesnt have an ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(); 
      await createEnrollmentWithAddress(user);
      await createTicketTypeCorrect();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
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

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesnt have an payment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with empty array when there are no Hotel created", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and with existing Hotel data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([{
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString()
      }]);
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/hotels/1");
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe("when token is valid", () => {
    it("should respond with status 404 if body param hotelId does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
      const token = await generateValidToken(); 

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesnt have an ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(); 
      await createEnrollmentWithAddress(user);
      await createTicketTypeCorrect();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
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

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesnt have an payment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(); 
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with empty object when there are no Rooms created", async () => {
      const user = await createUser();
      const token = await generateValidToken(user); 
      const hotel = await createHotel();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.body).toEqual({
        id: hotel.id,
        image: hotel.image,
        name: hotel.name,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
        Rooms: []
      });
    });

    it("should respond with status 200 when hotelId exist and list available rooms", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room =  await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeCorrect();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      await updateTicket(ticket.id);

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({
        id: hotel.id,
        image: hotel.image,
        name: hotel.name,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
        Rooms: [
          {
            id: room.id,
            capacity: room.capacity,
            hotelId: room.hotelId,
            name: room.name,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
          }
        ]
      });
    });
  });
});
