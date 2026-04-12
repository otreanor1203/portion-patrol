import { ObjectId } from "mongodb";
import { chipotles } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { checkId } from "../helpers.js";

const exportedMethods = {
  async createChipotle(state, location, address) {
    if (typeof state !== "string") {
      throw new Error("State must be a string");
    }

    if (typeof location !== "string") {
      throw new Error("Location must be a string");
    }

    if (typeof address !== "string") {
      throw new Error("Address must be a string");
    }

    const chipotleCollection = await chipotles();

    const newChipotle = {
      state,
      location,
      address,
      ratings: [],
      likes: 0,
      dislikes: 0,
      overallRating: 0,
    };

    const insertInfo = await chipotleCollection.insertOne(newChipotle);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw {
        status: 500,
        function: "createChipotle",
        error: "Could not add chipotle.",
      };
    }

    const newId = insertInfo.insertedId.toString();

    newChipotle._id = newId;

    return newChipotle;
  },

  async getAllChipotles() {
    const chipotleCollection = await chipotles();
    let chipotleList = await chipotleCollection.find({}).toArray();
    if (!chipotleList) {
      throw {
        status: 500,
        function: "getAllChipotles",
        error: "Could not retrieve list of all chipotles.",
      };
    }
    chipotleList = chipotleList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return chipotleList;
  },

  async getChipotleById(id) {
    try {
      id = checkId(id, "getChipotleById", "chipotle");
    } catch (e) {
      throw e;
    }
    const chipotleCollection = await chipotles();
    const chipotle = await chipotleCollection.findOne({
      _id: new ObjectId(id),
    });
    return chipotle;
  },

  // TODO: stop a user from rating the same chipotle multiple times or have it update the old review.
  async addRating(chipotleId, userId, rating, comment) {
    try {
      chipotleId = checkId(chipotleId, "addRating", "chipotle");
      userId = checkId(userId, "addRating", "user");
    } catch (e) {
      throw e;
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      throw {
        status: 400,
        function: "addRating",
        error: "Rating must be a number between 1 and 5.",
      };
    }
    if (typeof comment !== "string") {
      throw {
        status: 400,
        function: "addRating",
        error: "Comment must be a string.",
      };
    }

    const chipotleCollection = await chipotles();

    const chipotle = await chipotleCollection.findOne({
      _id: new ObjectId(chipotleId),
    });

    if (!chipotle) {
      throw {
        status: 400,
        function: "addRating",
        error: "Chipotle not found.",
      };
    }

    const userCollection = await users();
    const user = await userCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      throw {
        status: 400,
        function: "addRating",
        error: "User not found.",
      };
    }

    const newRating = {
      userId,
      rating,
      comment,
    };

    const updatedRatings = chipotle.ratings || [];
    updatedRatings.push(newRating);

    const overallRating =
      updatedRatings.reduce((sum, r) => sum + r.rating, 0) /
      updatedRatings.length;

    const updateInfo = await chipotleCollection.updateOne(
      { _id: new ObjectId(chipotleId) },
      { $set: { ratings: updatedRatings, overallRating: overallRating } },
    );

    if (!updateInfo.acknowledged) {
      throw {
        status: 500,
        function: "addRating",
        error: "Could not add rating.",
      };
    }

    return newRating;
  },
};

export default exportedMethods;
