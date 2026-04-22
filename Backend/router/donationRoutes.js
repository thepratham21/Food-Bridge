import express from "express";
import {
  createDonationOrder,
  verifyDonation,
  getUserDonations,
  getDonationStats
} from "../controller/donationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-order", createDonationOrder);
router.post("/verify", verifyDonation);
router.get("/user-donations", isAuthenticated, getUserDonations);
router.get("/stats", isAuthenticated, getDonationStats);

export default router;