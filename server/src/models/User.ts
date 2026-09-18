import mongoose from "mongoose";
import { IUser } from "../../types/index.js";


const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    image: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: true
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
}, { timestamps: true })


const User = mongoose.model<IUser>('User', userSchema)

export default User;