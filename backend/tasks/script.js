import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chipotles } from "../config/mongoCollections.js";
import { closeConnection } from "../config/mongoConnection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, "chipotle_stores.csv");

const csv = fs.readFileSync(csvPath, "utf8");

const lines = csv.trim().split("\n");
const headers = lines[0].split(",");

const parsedData = lines.slice(1).map((line) => {
  const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  const values = line.split(regex);

  const obj = {};
  headers.forEach((header, index) => {
    let value = values[index].replace(/^"|"$/g, "");

    if (!isNaN(value) && value.trim() !== "") {
      value = parseFloat(value);
    }

    obj[header] = value;
  });
  return obj;
});

try {
  const chipotleCollection = await chipotles();

  for (let i = 0; i < parsedData.length; i++) {
    parsedData[i].ratings = [];
    parsedData[i].likes = 0;
    parsedData[i].dislikes = 0;
    parsedData[i].overallRating = 0;
  }

  await chipotleCollection.deleteMany({});
  const insertInfo = await chipotleCollection.insertMany(parsedData);

  if (!insertInfo.acknowledged) {
    throw new Error("Could not add chipotles.");
  }

  console.log(`Chipotles successfully seeded.`);
} finally {
  await closeConnection();
}
