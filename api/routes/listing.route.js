import express from "express";
import {
	createListing,
	deleteListing,
	updateListing,
	getLisitng,
	searchListings,
} from "../controllers/listing.controller.js";
import { veriryToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", veriryToken, createListing);
router.delete("/delete/:id", veriryToken, deleteListing);
router.put("/update/:id", veriryToken, updateListing);
router.get("/get/:id", getLisitng);
router.get("/search", searchListings);

export default router;
