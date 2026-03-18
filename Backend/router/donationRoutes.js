import express from "express";
import {
  createDonationOrder,
  verifyDonation,
  getUserDonations
} from "../controller/donationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-order", createDonationOrder);
router.post("/verify", verifyDonation);
router.get("/user-donations", isAuthenticated, getUserDonations);

export default router;