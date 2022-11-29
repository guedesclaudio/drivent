import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import { listBooking } from "@/controllers/bookings-controller";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/")
  .post("/")
  .put("/");

export { bookingsRouter };
