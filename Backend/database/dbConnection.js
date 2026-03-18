import mongoose from "mongoose";
import dns from "dns";

// Programmatically set DNS servers to Google's to bypass local ISP DNS issues
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log("🌐 Programmatic DNS set to Google (8.8.8.8)");
} catch (e) {
    console.warn("⚠️ Could not set programmatic DNS servers.");
}

export const dbConnection = async (retries = 3) => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined in the environment variables.");
        }

        // Add a small delay before connecting to let network stabilize
        if (retries === 3) await new Promise(resolve => setTimeout(resolve, 1000));

        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "VIT",
            serverSelectionTimeoutMS: 15000, // Increased to 15s
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4 to avoid some DNS resolution issues in Node
        });

        console.log("✅ Connected to MongoDB Atlas successfully!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:");
        console.error(`   - Message: ${err.message}`);
        
        if (retries > 0) {
            const delay = (4 - retries) * 5000; // Progressive delay: 5s, 10s, 15s
            console.log(`🔄 Retrying connection in ${delay/1000} seconds... (${retries} retries left)`);
            setTimeout(() => dbConnection(retries - 1), delay);
            return;
        }

        if (err.message.includes("ESERVFAIL") || err.message.includes("ENOTFOUND")) {
            console.error("\n💡 CRITICAL DNS FAILURE:");
            console.error("   Your computer is still failing to resolve MongoDB Atlas addresses.");
            console.error("   1. RUN THIS COMMAND: 'ipconfig /flushdns' in your terminal.");
            console.error("   2. PERMANENT FIX: You MUST change your Windows Network Adapter settings to use Google DNS (8.8.8.8).");
            console.error("   3. RESTART: Close this terminal and open a new one after changing settings.");
        }
    }
};