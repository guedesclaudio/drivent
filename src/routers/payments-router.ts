import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPayments } from "@/controllers/payments-controller";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/payments", getPayments)
  .post("/payments/process");

export { paymentsRouter };
