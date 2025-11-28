import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected ✔️");
  } catch (err) {
    console.log("MongoDB Error ❌", err.message);
  }
};

export default connectDB;
