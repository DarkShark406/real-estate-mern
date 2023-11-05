import express from "express";
import {
	createListing,
	deleteListing,
	updateListing,
} from "../controllers/listing.controller.js";
import { veriryToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", veriryToken, createListing);
router.delete("/delete/:id", veriryToken, deleteListing);
router.put("/update/:id", veriryToken, updateListing);

export default router;
