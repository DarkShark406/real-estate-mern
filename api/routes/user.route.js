import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { veriryToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update/:id", veriryToken, updateUser);
router.delete("/delete/:id", veriryToken, deleteUser);

export default router;
