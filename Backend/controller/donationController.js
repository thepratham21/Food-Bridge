import razorpay from "../rz-config/razorpay.js";
import crypto from "crypto";
import Donation from "../models/donationSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddeware.js";



// CREATE ORDER + PENDING DONATION

export const createDonationOrder = catchAsyncErrors(async (req, res, next) => {
    const { amount, donorName, donorEmail, userId } = req.body;

    // Validation
    if (!amount || amount < 1) {
        return next(new ErrorHandler("Invalid donation amount", 400));
    }

    const options = {
        amount: amount * 100, // Amount in paise
        currency: "INR",
        receipt: "donation_" + Date.now(),
        notes: {
            userId: userId || "Anonymous",
            donorName: donorName || "Anonymous"
        }
    };

    const order = await razorpay.orders.create(options);

    // Create pending donation
    const donation = await Donation.create({
        donorName: donorName || "Anonymous",
        donorEmail: donorEmail || "N/A",
        userId: userId || null,
        amount,
        orderId: order.id,
        status: "pending"
    });

    res.status(200).json({
        success: true,
        order,
        donationId: donation._id
    });
});



// VERIFY PAYMENT (MAIN FLOW)

export const verifyDonation = catchAsyncErrors(async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {

        const donation = await Donation.findOneAndUpdate(
            { orderId: razorpay_order_id, status: "pending" }, // prevent duplicate updates
            {
                paymentId: razorpay_payment_id,
                status: "success"
            },
            { new: true }
        );

        if (!donation) {
            return next(new ErrorHandler("Donation record not found", 404));
        }

        return res.status(200).json({
            success: true,
            donation
        });

    } else {
        return next(new ErrorHandler("Payment verification failed", 400));
    }
});


// GET USER DONATIONS

export const getUserDonations = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;

    const donations = await Donation.find({ userId, status: "success" })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        donations
    });
});