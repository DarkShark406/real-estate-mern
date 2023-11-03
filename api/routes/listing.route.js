import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { veriryToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", veriryToken, createListing);

export default router;
