import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User.js";

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

interface TokenPayload extends JwtPayload {
  id: string;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    async (err, decoded) => {
      if (err || !decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const payload = decoded as TokenPayload;

      const user = await User.findById(payload.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;

      next();
    }
  );
};