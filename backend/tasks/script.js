import fs from "fs";
import { chipotles } from "../config/mongoCollections.js";

const csv = fs.readFileSync("chipotle_stores.csv", "utf8");

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

const chipotleCollection = await chipotles();

const insertInfo = await chipotleCollection.insertMany(parsedData);

if (!insertInfo.acknowledged) {
  throw {
    status: 500,
    function: "createUser",
    error: "Could not add chipotles.",
  };
}

process.exit(0);
