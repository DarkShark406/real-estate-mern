import express from "express";
import {
	createListing,
	deleteListing,
} from "../controllers/listing.controller.js";
import { veriryToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", veriryToken, createListing);
router.delete("/delete/:id", veriryToken, deleteListing);
export default router;
