import { listHotels, listRoomsPerHotelById } from "@/controllers/hotels-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", listHotels)
  .get("/:hotelId", listRoomsPerHotelById);

export { hotelsRouter };
