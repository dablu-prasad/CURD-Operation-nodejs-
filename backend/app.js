import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import connectDB from './config/connectdb.js'
import userrouter from './routes/userRoutes.js';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import noterouter from './routes/noteRoutes.js';

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

// CORS Policy
app.use(cors())

// Database Connection
connectDB(DATABASE_URL)

// JSON
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({useTempFiles:true}));

// Load Routes
app.use("/api/user/v1", userrouter)
app.use("/api/notes/v1", noterouter)



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})