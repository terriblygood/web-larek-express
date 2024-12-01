import { Schema, model } from "mongoose";

export interface IProduct  {
    title: string;
    image: { fileName: string, originalName: string; };
    category: string;
    description: string;
    price: number;
}

const productSchema = new Schema<IProduct>({ 
    title: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
        unique: true
    },
    image: {
        type: { fileName: String, originalName: String },
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: null
    }
})



export default model<IProduct>('product', productSchema);