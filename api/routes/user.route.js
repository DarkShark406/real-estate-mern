import express from "express";
import {
	updateUser,
	deleteUser,
	getUserListings,
} from "../controllers/user.controller.js";
import { veriryToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update/:id", veriryToken, updateUser);
router.delete("/delete/:id", veriryToken, deleteUser);
router.get("/listings/:id", veriryToken, getUserListings);

export default router;
