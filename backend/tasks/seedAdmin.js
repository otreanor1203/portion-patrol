import bcrypt from "bcryptjs";

import { users } from "../config/mongoCollections.js";
import { closeConnection } from "../config/mongoConnection.js";

const saltRounds = 10;

const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "Password123!";

try {
  const userCollection = await users();
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

  const existingAdmin = await userCollection.findOne({
    username: adminUsername,
  });

  if (existingAdmin) {
    throw new Error("Admin already exists");
  } else {
    const insertInfo = await userCollection.insertOne({
      username: adminUsername,
      password: hashedPassword,
      admin: true,
      likedChipotles: [],
      dislikedChipotles: [],
    });

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error("Could not create admin user.");
    }
  }

  console.log("Admin created");
} finally {
  await closeConnection();
}
