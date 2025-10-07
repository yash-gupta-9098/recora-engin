import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

const prisma = global.prisma || new PrismaClient();

export default prisma;


// import mongoose from "mongoose";

// let isConnected = false;

// export function dbConnect() {
//   if (isConnected) {
//     return;
//   }
  
//   console.log('Connecting to database...');
  
//   try {
//     if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {

      
      
//       const connection_string = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@recora-db.njuv0.mongodb.net/?retryWrites=true&w=majority&appName=recora-db`;
      
//       console.log('Attempting connection...');
      
//       // mongoose.connect(connection_string);
//       mongoose.connect(connection_string, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
      
//       isConnected = true;
//       console.log("MongoDB connected successfully");
//     } else {
//       throw new Error("Database credentials not provided in environment variables");
//     }
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     throw error;
//   }
// }

// // Connect when this file is imported, but handle the promise properly
// dbConnect();
