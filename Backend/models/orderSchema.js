import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    foodDetails: {
        type: String,
        required: [true, "Food details are required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    pincode: {
        type: String,
        required: [true, "Pincode is required"],
        minLength: [6, "Pincode must be 6 digits"],
        maxLength: [6, "Pincode must be 6 digits"]
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected", "Completed"],
        default: "Pending"
    },
    foodType: {
        type: String,
        enum: ["Veg", "Non-veg"],
        default: "Veg"
    },
    foodStyle: {
        type: String,
        enum: ["Raw Food", "Cooked Food"],
        default: "Cooked Food"
    },
    foodtime:{
        type:Date
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
