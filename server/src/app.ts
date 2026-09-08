import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/authRoutes.js";
import productRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors())
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.use('/api/auth', router)
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);


export default app;