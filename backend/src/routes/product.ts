import { Router } from "express";
import { createProduct, getProducts, productValidator} from "../controllers/product";

const router = Router();

router.get('/product', getProducts)
router.post('/product',productValidator, createProduct)

export default router;