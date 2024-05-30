import express from "express";
import {
  Register,
  Login,
  Logout,
  RegisterMember,
} from "../controllers/authController.js";
import { getUsers, deleteUsers } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/refreshToken.js";
import { Me } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", verifyToken, Register);
router.post("/member", RegisterMember);
router.get("/me", Me);
router.post("/login", Login);
router.delete("/logout", Logout);
router.get("/token", refreshToken);
router.delete("/users/:id", deleteUsers);

export default router;
