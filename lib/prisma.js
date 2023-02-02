import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// Commenting this out cause I'm not getting autocompletion

//check if we are running in production mode
// if (process.env.NODE_ENV === "production") {
// } else {
//   //check if there is already a connection to the database
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }
