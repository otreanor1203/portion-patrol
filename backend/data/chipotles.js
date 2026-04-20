import { ObjectId } from "mongodb";
import { chipotles } from "../config/mongoCollections.js";
import { requests } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { checkId } from "../helpers.js";

const exportedMethods = {
  async createChipotle(requestId, state, location, address) {
    try {
      requestId = checkId(requestId, "createChipotle", "Request ID");
    } catch (e) {
      throw e;
    }

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

    const requestCollection = await requests();
    const deleteInfo = await requestCollection.deleteOne({
      _id: new ObjectId(requestId),
    });

    if (!deleteInfo.acknowledged) {
      throw {
        status: 500,
        function: "createChipotle",
        error: "Chipotle added but could not delete request.",
      };
    }

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

    return chipotleList.map((c) => {
      c._id = c._id.toString();
      return c;
    });
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

    if (!chipotle) return null;

    chipotle._id = chipotle._id.toString();
    return chipotle;
  },

  async addRating(chipotleId, userId, rating, comment) {
    chipotleId = checkId(chipotleId, "addRating", "chipotle");
    userId = checkId(userId, "addRating", "user");
  
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
    const userCollection = await users();
  
    const chipotle = await chipotleCollection.findOne({
      _id: new ObjectId(chipotleId),
    });
  
    const user = await userCollection.findOne({
      _id: new ObjectId(userId),
    });
  
    if (!chipotle) {
      throw { status: 400, function: "addRating", error: "Chipotle not found." };
    }
  
    if (!user) {
      throw { status: 400, function: "addRating", error: "User not found." };
    }
  
    const newRating = {
      userId: userId.toString(),
      username: user.username,
      rating: Number(rating),
      comment,
    };
  
    let ratings = chipotle.ratings || [];
  
    ratings = ratings.filter(
      (r) => r.userId !== userId.toString()
    );

    ratings.push(newRating);
  
    const total = ratings.reduce((sum, r) => sum + Number(r.rating), 0);
  
    const overallRating = ratings.length > 0 ? total / ratings.length : 0;
  
    const updateInfo = await chipotleCollection.updateOne(
      { _id: new ObjectId(chipotleId) },
      {
        $set: {
          ratings,
          overallRating,
        },
      }
    );
  
    if (!updateInfo.acknowledged) {
      throw {
        status: 500,
        function: "addRating",
        error: "Could not add rating.",
      };
    }
  
    return newRating;
  }
};

export default exportedMethods;
