import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import path from 'path';
import routers from './routes'
import { errors } from "celebrate";
import {errorHandler} from './middlewares/error-handler';
// import { errorLogger, requestLogger } from './middlewares/logger';
import { errorLogger, requestLogger } from "./middlewares/logger";
const cors = require('cors')
import { PORT, DB_ADDRESS } from "./config";



dotenv.config();
const app = express();
mongoose.connect(DB_ADDRESS)
  .then(() => {
    console.log("Connected to MongoDB",' 111');
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

app.use(requestLogger);
app.use('/', routers);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);




app.listen(PORT, () => {
    console.log(`listening1 on port ${PORT}`, DB_ADDRESS)
})