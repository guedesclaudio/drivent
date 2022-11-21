import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPayments, postPayment } from "@/controllers/payments-controller";
import { validateBodyPayment, validateBodyTicketId } from "@/middlewares/payments-middleware";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", validateBodyTicketId, getPayments)
  .post("/process", validateBodyPayment, postPayment);

export { paymentsRouter };
