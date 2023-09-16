import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import stateRoute from "./routes/stateRoute/index.js";
import regionRoute from "./routes/regionRoute/index.js";
import locationRoute from "./routes/location/index.js";
import userRoute from "./routes/user/userRoute.js";
import resturantRoute from './routes/resturantRoute/index.js'
import reservationRoute from "./routes/reservationRoute/index.js";
import payment from "./routes/paymentRoute/index.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
dotenv.config();

const Port = process.env.PORT || 5000

app.listen(Port,()=>{
    console.log(`app running  on port: ${Port}`);
})

app.get('/', (req, res)=>{
    res.status(200).send(`Jolly food on wheels`)
})

app.use('/api/v1/Jollyfoods', stateRoute)
app.use('/api/v1/Jollyfoods', regionRoute)
app.use('/api/v1/Jollyfoods', locationRoute)
app.use('/api/v1/Jollyfoods', userRoute)
app.use('/api/v1/Jollyfoods', resturantRoute)
app.use('/api/v1/Jollyfoods', reservationRoute)
app.use('/api/v1/Jollyfoods', payment)

const URI = process.env.connection_URI


mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));