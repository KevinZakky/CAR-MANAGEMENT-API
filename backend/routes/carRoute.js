import express, { Router } from "express";
import {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";
import { verifyUser, adminSuperAdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/cars", getCars);
router.get("/cars/:id", getCarById);
router.post("/cars", verifyUser, adminSuperAdminOnly, addCar);
router.put("/cars/:id", verifyUser, adminSuperAdminOnly, updateCar);
router.delete("/cars/:id", verifyUser, adminSuperAdminOnly, deleteCar);

export default router;
