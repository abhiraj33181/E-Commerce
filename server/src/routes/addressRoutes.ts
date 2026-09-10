import express from "express";
import { auth } from "../middleware/auth.js";
import {getAddresses, addAddress, updateAddress, deleteAddress} from "../controller/addressController.js";

const AddressRouter = express.Router();

AddressRouter.get("/", auth, getAddresses);
AddressRouter.post("/", auth, addAddress);
AddressRouter.put("/:id", auth, updateAddress);
AddressRouter.delete("/:id", auth, deleteAddress);


export default AddressRouter;