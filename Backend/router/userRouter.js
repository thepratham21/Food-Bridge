import express from "express";
import {
    registerUser,
    loginUser,
    getUserDetails,
    getAllVolunteers,
    getAllNGOs,
    logoutUser,
    getGlobalStats,
    getUserImpact,
    getLeaderboard,
    updateMyProfile,
    updateMyPassword,
    getRecentActivity
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// Register User (Volunteer, NGO, or Donor)
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get User Details (Authenticated Users Only)
router.get("/me", isAuthenticated, getUserDetails);

// Get All Volunteers
router.get("/volunteers", getAllVolunteers);

// Get All NGOs
router.get("/ngos", getAllNGOs);

// Logout User
router.get("/logout", logoutUser);

// Stats & Leaderboard (Public/User)
router.get("/stats", getGlobalStats);
router.get("/leaderboard", getLeaderboard);
router.get("/activities", getRecentActivity);
router.get("/impact", isAuthenticated, getUserImpact);

// Profile Management
router.put("/profile/update", isAuthenticated, updateMyProfile);
router.put("/password/update", isAuthenticated, updateMyPassword);

// Test email route — open http://localhost:4000/api/v1/user/test-email in browser to verify SMTP
router.get("/test-email", async (req, res) => {
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPass) {
        return res.json({ success: false, reason: "SMTP_EMAIL or SMTP_PASSWORD not set in env", smtpEmail: smtpEmail || "MISSING" });
    }

    try {
        await sendEmail({
            to: smtpEmail,
            subject: "FoodBridge SMTP Test",
            html: "<p>If you see this, email is working correctly!</p>",
        });
        res.json({ success: true, message: `Test email sent to ${smtpEmail}. Check inbox (and spam).` });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

export default router;
