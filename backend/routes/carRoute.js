import express, { Router } from "express";
import {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyUser, adminSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/cars", verifyToken, getCars);
router.get("/cars/:id", getCarById);
router.post("/cars", verifyToken, verifyUser, adminSuperAdminOnly, addCar);
router.put(
  "/cars/:id",
  verifyToken,
  verifyUser,
  adminSuperAdminOnly,
  updateCar
);
router.delete(
  "/cars/:id",
  verifyToken,
  verifyUser,
  adminSuperAdminOnly,
  deleteCar
);

export default router;
