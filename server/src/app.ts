import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/authRoutes.js";
import productRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import OrderRouter from "./routes/ordersRoutes.js";
import AddressRouter from "./routes/addressRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import morgan from "morgan";
import { seedProducts } from "./scripts/seedProducts.js";

const app = express();

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("MongoDB Connection Error:", err);
});

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/auth', router)
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/address', AddressRouter);
app.use('/api/admin', AdminRouter);


// Seed Dummy Product if no products are present
// await seedProducts(process.env.MONGODB_URI  as string);

export default app;