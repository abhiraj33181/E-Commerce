import Address from "../models/Address.js";
import { Request, Response } from "express";

// Get User Address
export const getAddresses = async (req: Request, res: Response) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            data: addresses,
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching addresses",
        });
    }
}

// Add New Address
export const addAddress = async (req: Request, res: Response) => {
    try {
        const {type, street, city, state, zipCode, country, isDefault} = req.body;

        if (isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false });
        }
        const newAddress = await Address.create({
            user: req.user._id,
            type,
            street,
            city,
            state,
            zipCode,
            country,
            isDefault : isDefault || false,
        });
        res.status(201).json({
            success: true,
            data: newAddress,
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message || "Error adding address",
        });
    }
}

// Update Address
export const updateAddress = async (req: Request, res: Response) => {
    try {
        const {type, street, city, state, zipCode, country, isDefault} = req.body;

        let addressItem = await Address.findOne({ _id: req.params.id, user: req.user._id });
        if (!addressItem) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        if (isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false });
        }

        addressItem = await Address.findByIdAndUpdate(
            req.params.id,
            {
                type,
                street,
                city,
                state,
                zipCode,
                country,
                isDefault : isDefault || false,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: addressItem,
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message || "Error updating address",
        });
    }
}


// Delete Address
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const addressItem = await Address.findOne({ _id: req.params.id, user: req.user._id });
        if (!addressItem) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }
        await Address.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Address deleted",
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting address",
        });
    }
}