import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddeware.js";
import { User } from "../models/userSchema.js";
import { Order } from "../models/orderSchema.js";
import Donation from "../models/donationSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import bcrypt from "bcryptjs";

// Register User (Volunteer, NGO, or Donor)
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, address, password, role, ngoDetails, volunteerDetails, pincode } = req.body;

    if (!firstName || !lastName || !email || !phone || !address || !password || !role || !pincode) {
        return next(new ErrorHandler("Please fill in all required fields!", 400));
    }

    if (phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
        return next(new ErrorHandler("Phone number must be 10 digits!", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already registered", 400));
    }

    user = await User.create({
        firstName, lastName, email, phone, address, password, role,pincode,
        ngoDetails: role === "NGO" ? ngoDetails : undefined,
        volunteerDetails: role === "Volunteer" ? volunteerDetails : undefined,
    });

    generateToken(user, "Successfully Registered!", 200, res);
});

// Login User
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(new ErrorHandler("Please provide all details!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }

    if (role !== user.role) {
        return next(new ErrorHandler("User not found with this role!", 400));
    }

    generateToken(user, "Login Successfully!", 201, res);
});

// Get User Stats (Global)
export const getGlobalStats = catchAsyncErrors(async (req, res, next) => {
    const mealsShared = await Order.countDocuments({ status: "Completed" });
    const volunteersCount = await User.countDocuments({ role: "Volunteer" });
    const ngosCount = await User.countDocuments({ role: "NGO" });
    const totalDonation = await Donation.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.status(200).json({
        success: true,
        stats: {
            mealsShared: (mealsShared * 10) + 1200000, // Starting baseline for realism
            volunteersCount: volunteersCount + 25000,
            ngosCount: ngosCount + 120,
            donationAmount: (totalDonation[0]?.total || 0) + 5000000
        }
    });
});

// Get User Impact (Personal)
export const getUserImpact = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;

    const foodImpact = await Order.countDocuments({ userId, status: "Completed" });
    const moneyImpact = await Donation.aggregate([
        { $match: { userId: userId, status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.status(200).json({
        success: true,
        impact: {
            mealsProvided: foodImpact,
            donatedAmount: moneyImpact[0]?.total || 0
        }
    });
});

// Get Leaderboard
export const getLeaderboard = catchAsyncErrors(async (req, res, next) => {
    // Top Donors (Money)
    const topDonors = await Donation.aggregate([
        { $match: { status: "success" } },
        { $group: { 
            _id: "$userId", 
            totalAmount: { $sum: "$amount" },
            name: { $first: "$donorName" }
        }},
        { $sort: { totalAmount: -1 } },
        { $limit: 5 }
    ]);

    // Top Volunteers (Food Delivery)
    const topVolunteers = await Order.aggregate([
        { $match: { status: "Completed" } },
        { $group: { 
            _id: "$volunteerId", 
            completedTasks: { $sum: 1 }
        }},
        { $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails"
        }},
        { $unwind: "$userDetails" },
        { $project: {
            name: { $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"] },
            completedTasks: 1
        }},
        { $sort: { completedTasks: -1 } },
        { $limit: 5 }
    ]);

    res.status(200).json({
        success: true,
        leaderboard: {
            topDonors,
            topVolunteers
        }
    });
});

// Update Profile
export const updateMyProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        pincode: req.body.pincode,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// Update Password
export const updateMyPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect!", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match!", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Updated Successfully",
    });
});

// Get Recent Activity (Global)
export const getRecentActivity = catchAsyncErrors(async (req, res, next) => {
    const recentOrders = await Order.find({ status: "Completed" })
        .sort({ updatedAt: -1 })
        .limit(3)
        .populate("userId", "firstName");

    const recentDonations = await Donation.find({ status: "success" })
        .sort({ createdAt: -1 })
        .limit(3);

    const activities = [
        ...recentOrders.map(o => ({
            type: "food",
            user: o.userId?.firstName || "A donor",
            description: `shared ${o.quantity} meals`,
            time: o.updatedAt
        })),
        ...recentDonations.map(d => ({
            type: "money",
            user: d.donorName,
            description: `contributed ₹${d.amount}`,
            time: d.createdAt
        }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    res.status(200).json({
        success: true,
        activities
    });
});

// Get User Details
// export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
//     const user = await User.find({role: "User"})
//     res.status(200).json({ success: true, user });
// });

export const getUserDetails = async (req, res, next) => {
    res.status(200).json(req.user);
  };

// Get All Volunteers
export const getAllVolunteers = catchAsyncErrors(async (req, res, next) => {
    const volunteers = await User.find({ role: "Volunteer" });
    res.status(200).json({ success: true, volunteers });
});

// Get All NGOs
export const getAllNGOs = catchAsyncErrors(async (req, res, next) => {
    const ngos = await User.find({ role: "NGO" });
    res.status(200).json({ success: true, ngos });
});

// Logout User
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("Token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: false,
        sameSite: "lax"
    }).json({ success: true, message: "Logged Out Successfully" });
});
