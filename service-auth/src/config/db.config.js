import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
  } catch (err) {
    console.log(err);
    console.error("Failed to connect to the database");
  }
})();

export default prisma;
