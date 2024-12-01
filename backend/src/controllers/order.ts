import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import Product from '../models/product';
import BadRequestError from '../errors/bad-req';

export const orderSchema = Joi.object<IOrder>({
    payment: Joi.equal('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .regex(/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/)
      .required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().required(),
});

export const orderValidator = celebrate({
    [Segments.BODY]: orderSchema,
  });
  

interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
        const checker = orderSchema.validate(req.body as IOrder)
        if (checker.error) {
            return next(new BadRequestError(`Validation error: ${checker.error.message}`));
        }
        const products = ( 
            await Product.find({_id: { $in: checker.value.items.map((item: string) => new mongoose.Types.ObjectId(item))}})
        ).filter((product) => !!product.price)

        const orderSum = products.reduce((sum, curr) => sum + curr.price, 0);
        if (checker.value.total !== orderSum) {
            return next( new BadRequestError( 'Order data error: order total sum wrong'));
          }

        return res.status(201).send({
            id: uuidv4(),
            total: orderSum,
          });

}