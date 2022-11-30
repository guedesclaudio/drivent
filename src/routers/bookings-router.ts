import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import { changeBooking, listBooking, createBooking } from "@/controllers/bookings-controller";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", listBooking)
  .post("/", createBooking)
  .put("/:bookingId", changeBooking);

export { bookingsRouter };
