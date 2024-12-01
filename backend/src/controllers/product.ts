import { NextFunction, Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import Product, { IProduct } from '../models/product';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-req';
import ConflictError from '../errors/conflict';

export const getProducts = (req: Request, res: Response, next: NextFunction) => 
    Product.find({})
        .then((products) => {
        res.status(201).send({items: products, total: products.length})
})

export const productSchema = Joi.object<IProduct>({
    title: Joi.string().min(3).max(30).required(),
    image: { fileName: Joi.string(), originalName: Joi.string() },
    category: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number(),
});

export const productValidator = celebrate({
    [Segments.BODY]: productSchema,
});


export const createProduct = (req: Request, res: Response, next: NextFunction) => {
    const {title, image, category, description, price} = req.body;
    return Product.create({ title, image, category, description, price }).then((product) => res.status(201).send({data: product}))
        .catch((err) => {
            if (err instanceof MongooseError.ValidationError) {
                return next(new BadRequestError(err.message));
            }

            if (err instanceof Error && err.message.includes('E11000')) {
                return next(new ConflictError(err.message));
              }
        })
}