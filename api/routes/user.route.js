import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { veriryToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update/:id", veriryToken, updateUser);

export default router;
