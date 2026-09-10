import express from 'express';
import { auth } from '../middleware/auth.js';
import { getDashboardStats } from '../controller/adminController.js';

const AdminRouter = express.Router();

// Get Admin Dashboard Stats
AdminRouter.get('/stats', auth, getDashboardStats);

export default AdminRouter;

