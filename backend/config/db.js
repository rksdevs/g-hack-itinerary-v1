
import mongoose from "mongoose";

export const connect = async() => {
    try {
       const conn = await mongoose.connect(process.env.MONGO_URI);
       console.log("DB connected, hostname: ", conn.connection.host)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}