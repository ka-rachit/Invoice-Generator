const mongoose = require("mongoose")
const dns = require("dns")

dns.setServers(["1.1.1.1", "8.8.8.8"]) // Force good DNS

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{});
        console.log("MongoDB Connected");
        
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB