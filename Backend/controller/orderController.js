import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddeware.js";
import { Order } from "../models/orderSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail, emailTemplates } from "../utils/sendEmail.js";

// Place an order (User requests food)
export const placeOrder = catchAsyncErrors(async (req, res, next) => {
    // Ensure the user has the "User" role
    if (req.user.role !== 'User') {
        return next(new ErrorHandler("You are not authorized to place an order", 403));
    }

    const { foodDetails, quantity, address, pincode, foodtime, foodType, foodStyle } = req.body;
    const userId = req.user._id; // Get logged-in user's ID

    if (!foodDetails || !quantity || !address || !pincode || !foodtime || !foodType || !foodStyle) {
        return next(new ErrorHandler("All fields are required!", 400));
    }

    const order = await Order.create({
        userId,
        foodDetails,
        quantity,
        address,
        pincode,
        foodtime,
        foodType,
        foodStyle,
        status: "Pending"
    });

    res.status(201).json({
        success: true,
        message: "Food request placed successfully!",
        order
    });
});


// Get all orders for NGO by their pincode
export const getOrdersForNGO = catchAsyncErrors(async (req, res, next) => {
    const ngoId = req.user._id; // Get logged-in NGO's ID

    // Fetch NGO details to get the pincode
    const ngo = await User.findById(ngoId);
    if (!ngo) {
        return next(new ErrorHandler("NGO not found!", 404));
    }
    if(ngo.role != "NGO"){
        return next(new ErrorHandler("Role is not Proper",404));
    }

    const orders = await Order.find({ pincode: ngo.pincode, status: "Pending" })
        .populate("userId", "firstName lastName phone email");

    res.status(200).json({
        success: true,
        orders: orders || []
    });
});

// Accept order & assign volunteer (NGO action)
export const acceptOrder = catchAsyncErrors(async (req, res, next) => {
    const { orderId, volunteerId } = req.body;
    const ngoId = req.user._id; // Use logged-in NGO's ID from middleware

    // Ensure the user is an NGO
    if (req.user.role !== 'NGO') {
        return next(new ErrorHandler("Only NGOs can accept orders", 403));
    }

    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    if (order.status !== "Pending") {
        return next(new ErrorHandler("Order is already processed!", 400));
    }

    // Update the order's status and assign the volunteer and NGO user
    order.status = "Accepted";
    order.volunteerId = volunteerId;
    order.ngoId = ngoId;  // Assign NGO user to the order
    await order.save();

    // Fetch the populated order details
    const populatedOrder = await Order.findById(orderId)
        .populate("ngoId", "firstName lastName address")  // Populate NGO user details
        .populate("volunteerId", "firstName lastName phone email")  // Populate volunteer details
        .populate("userId", "firstName lastName phone email"); // Populate user details

    await sendEmail({
        to: populatedOrder.userId?.email,
        subject: "✅ Your FoodBridge donation has been accepted!",
        html: emailTemplates.accepted({
            name: populatedOrder.userId?.firstName,
            foodDetails: populatedOrder.foodDetails,
            volunteerName: `${populatedOrder.volunteerId?.firstName} ${populatedOrder.volunteerId?.lastName}`,
            volunteerPhone: populatedOrder.volunteerId?.phone,
        }),
    });

    res.status(200).json({
        success: true,
        message: "Order accepted and volunteer assigned!",
        order: populatedOrder
    });
});



// Get accepted orders for volunteers (assigned to them)
export const getAcceptedOrdersForVolunteer = catchAsyncErrors(async (req, res, next) => {
    const volunteerId = req.user._id; // Get logged-in volunteer's ID

    const orders = await Order.find({ volunteerId, status: "Accepted" })
        .populate("userId", "firstName lastName phone email")
        .populate("ngoId", "firstName lastName address");

    res.status(200).json({
        success: true,
        orders: orders || []
    });
});

// Complete the order (Volunteers mark as delivered)
export const completeOrder = catchAsyncErrors(async (req, res, next) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    // Ensure the logged-in volunteer is the one assigned to this order
    if (!order.volunteerId || order.volunteerId.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not authorized to complete this order", 403));
    }

    if (order.status !== "Accepted") {
        return next(new ErrorHandler("Only accepted orders can be marked as completed", 400));
    }

    order.status = "Completed";
    await order.save();

    const completedOrder = await Order.findById(orderId).populate("userId", "firstName email");
    await sendEmail({
        to: completedOrder.userId?.email,
        subject: "🎊 Your FoodBridge donation was delivered!",
        html: emailTemplates.completed({
            name: completedOrder.userId?.firstName,
            foodDetails: completedOrder.foodDetails,
        }),
    });

    res.status(200).json({
        success: true,
        message: "Order marked as completed successfully!",
        order
    });
});

// Get all orders placed by the user
export const getAllOrdersByUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id; // Get logged-in user's ID

    // Fetch all orders placed by the user and populate userId, ngoId, and volunteerId
    const orders = await Order.find({ userId })
        .populate("userId", "firstName lastName phone email")
        .populate("ngoId", "firstName lastName address contactInfo")  // Adjust fields as needed for ngoId
        .populate("volunteerId", "firstName lastName phone email"); // Adjust fields as needed for volunteerId

    res.status(200).json({
        success: true,
        orders: orders || []
    });
});


// Controller to get completed orders by volunteer
export const getCompletedOrdersByVolunteer = catchAsyncErrors(async (req, res, next) => {
    const volunteerId = req.user.id;  // Get the logged-in volunteer's ID (from JWT or session)
  
    // Find all orders where the status is 'Completed' and filter by volunteerId
    const completedOrders = await Order.find({
      volunteerId: volunteerId,
      status: "Completed",  // Status should be 'Completed'
    })
      .populate("userId", "firstName lastName email phone")  // Populate user details
      .populate("ngoId", "firstName lastName address")  // Populate NGO details
      .populate("volunteerId", "firstName lastName email phone");  // Populate volunteer details
  
    res.status(200).json({
      success: true,
      orders: completedOrders || [],
    });
  });
  
// Cancel order (User/donor cancels their own pending order)
export const cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    if (order.userId.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You can only cancel your own orders", 403));
    }

    if (order.status !== "Pending") {
        return next(new ErrorHandler("Only pending orders can be cancelled", 400));
    }

    order.status = "Rejected";
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order cancelled successfully.",
        order
    });
});

// Reject order (NGO action)
export const rejectOrder = catchAsyncErrors(async (req, res, next) => {
    const { orderId } = req.body;

    if (req.user.role !== 'NGO') {
        return next(new ErrorHandler("Only NGOs can reject orders", 403));
    }

    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    if (order.status !== "Pending") {
        return next(new ErrorHandler("Only pending orders can be rejected", 400));
    }

    order.status = "Rejected";
    order.ngoId = req.user._id;
    await order.save();

    const rejectedOrder = await Order.findById(orderId).populate("userId", "firstName email");
    await sendEmail({
        to: rejectedOrder.userId?.email,
        subject: "📋 Update on your FoodBridge donation request",
        html: emailTemplates.rejected({
            name: rejectedOrder.userId?.firstName,
            foodDetails: rejectedOrder.foodDetails,
        }),
    });

    res.status(200).json({
        success: true,
        message: "Order rejected.",
        order
    });
});

// Get order history for NGO
export const getOrderHistory = catchAsyncErrors(async (req, res, next) => {
    const ngoId = req.user._id;

    const orders = await Order.find({ ngoId })
        .populate("userId", "firstName lastName address phone email")
        .populate("ngoId", "firstName lastName address")
        .populate("volunteerId", "firstName lastName phone email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders: orders || []
    });
});