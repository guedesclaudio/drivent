import httpStatus from "http-status";
import { prisma } from "@/config";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { createHotel, createRoom, createBooking } from "../factories/hotels-factory";
import { createUser } from "../factories";
import * as jwt from "jsonwebtoken";

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
    it("should respond with empty array when there are no Hotel created", async () => {
      const token = await generateValidToken();
      const response = await server.get("/tickets/types").set("Authorization", `Bearer ${token}`);
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and with existing Hotel data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
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
    /*it("should respond with status 400 if body param hotelId is missing", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });*/

    it("should respond with status 404 if body param hotelId does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 when hotelId exist and list available rooms", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room =  await createRoom(hotel.id);
      const booking = await createBooking(room.id, user.id, hotel.id);
      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([] || [
          {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            hotelId: room.hotelId,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString()
          }]));
    });
  });
});
