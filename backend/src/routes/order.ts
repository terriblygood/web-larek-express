import { Router } from "express";
import { orderValidator, createOrder } from "../controllers/order";

const router = Router();
router.post('/order', orderValidator, createOrder)

export default router;