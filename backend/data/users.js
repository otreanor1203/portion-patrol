import { ObjectId } from "mongodb";

import bcrypt from "bcryptjs";
const saltRounds = 10;

import { users, chipotles } from "../config/mongoCollections.js";

import {
  checkUsername,
  checkPassword,
  checkAdmin,
  checkId,
  checkString,
} from "../helpers.js";

const exportedMethods = {
  async createUser(username, password, admin) {
    username = checkUsername(username, "createUser");
    password = checkPassword(password, "createUser");
    admin = checkAdmin(admin, "createUser");

    let takenUsernames = await this.getTakenUsernames();

    if (takenUsernames.includes(username.toLowerCase())) {
      throw {
        status: 400,
        function: "createUser",
        error: "Username already taken.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
      username,
      password: hashedPassword,
      admin,
      likedChipotles: [],
      dislikedChipotles: [],
    };

    const userCollection = await users();

    const insertInfo = await userCollection.insertOne(newUser);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw {
        status: 500,
        function: "createUser",
        error: "Could not add user.",
      };
    }

    const newId = insertInfo.insertedId.toString();

    newUser._id = newId;

    return newUser;
  },

  async login(username, password) {
    username = checkUsername(username, "login");
    password = checkPassword(password, "login");

    let userList = await this.getAllUsers();

    let user;
    for (let u of userList) {
      if (u.username.toLowerCase() === username.toLowerCase()) {
        user = u;
        break;
      }
    }

    if (!user) {
      throw {
        status: 400,
        function: "login",
        error: "Either the username or password is wrong.",
      };
    }

    let compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw {
        status: 400,
        function: "login",
        error: "Either the username or password is wrong.",
      };
    }

    return {
      username: user.username,
      _id: user._id.toString(),
      admin: user.admin,
    };
  },

  async getAllUsers() {
    const userCollection = await users();

    let userList = await userCollection.find({}).toArray();

    if (!userList) {
      throw {
        status: 500,
        function: "getAllUsers",
        error: "Could not retrieve list of all users.",
      };
    }

    userList = userList.map((element) => {
      element._id = element._id.toString();
      return element;
    });

    return userList;
  },

  async getUserById(userId) {
    userId = checkId(userId, "getUserById");
  
    const userCollection = await users();
  
    const user = await userCollection.findOne({
      _id: new ObjectId(userId),
    });
  
    if (!user) {
      throw {
        status: 404,
        function: "getUserById",
        error: "User not found.",
      };
    }
  
    user._id = user._id.toString();
  
    return user;
  },

  async getTakenUsernames() {
    let userList = await this.getAllUsers();

    let usernames = userList.map((user) => user.username.toLowerCase());

    return usernames;
  },

  
  async likeChipotle(userId, chipotleId) {
    userId = checkId(userId, "likeChipotle");
    chipotleId = checkId(chipotleId, "likeChipotle");
  
    const userCollection = await users();
    const chipotleCollection = await chipotles();
  
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    const chipotle = await chipotleCollection.findOne({ _id: new ObjectId(chipotleId) });
  
    if (!user) {
      throw { status: 400, function: "likeChipotle", error: "User not found." };
    }
  
    if (!chipotle) {
      throw { status: 400, function: "likeChipotle", error: "Chipotle not found." };
    }
  
    const chipotleObjId = new ObjectId(chipotleId);
  
    const alreadyLiked = (user.likedChipotles || []).some(
      (id) => id.toString() === chipotleId
    );
  
    const alreadyDisliked = (user.dislikedChipotles || []).some(
      (id) => id.toString() === chipotleId
    );
  
    if (alreadyLiked) {
      return { liked: "already" };
    }
  
    const update = {
      $addToSet: { likedChipotles: chipotleObjId },
    };
  
    if (alreadyDisliked) {
      update.$pull = { dislikedChipotles: chipotleObjId };
    }
  
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      update
    );
  
    await chipotleCollection.updateOne(
      { _id: new ObjectId(chipotleId) },
      {
        $inc: {
          likes: 1,
          ...(alreadyDisliked ? { dislikes: -1 } : {}),
        },
      }
    );
  
    return { liked: "yes" };
  },
  async unlikeChipotle(userId, chipotleId) {
    userId = checkId(userId, "unlikeChipotle");
    chipotleId = checkId(chipotleId, "unlikeChipotle");
  
    const userCollection = await users();
    const chipotleCollection = await chipotles();
  
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  
    if (!user) {
      throw { status: 400, function: "unlikeChipotle", error: "User not found." };
    }
  
    const chipotleObjId = new ObjectId(chipotleId);
  
    const hasLiked = (user.likedChipotles || []).some(
      (id) => id.toString() === chipotleId
    );
  
    if (!hasLiked) {
      return { liked: "already-none" };
    }
  
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { likedChipotles: chipotleObjId } }
    );
  
    await chipotleCollection.updateOne(
      { _id: new ObjectId(chipotleId) },
      { $inc: { likes: -1 } }
    );
  
    return { liked: "no" };
  },
  async dislikeChipotle(userId, chipotleId) {
    userId = checkId(userId, "dislikeChipotle");
    chipotleId = checkId(chipotleId, "dislikeChipotle");
  
    const userCollection = await users();
    const chipotleCollection = await chipotles();
  
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    const chipotle = await chipotleCollection.findOne({ _id: new ObjectId(chipotleId) });
  
    if (!user) {
      throw { status: 400, function: "dislikeChipotle", error: "User not found." };
    }
  
    if (!chipotle) {
      throw { status: 400, function: "dislikeChipotle", error: "Chipotle not found." };
    }
  
    const chipotleObjId = new ObjectId(chipotleId);
  
    const alreadyDisliked = (user.dislikedChipotles || []).some(
      (id) => id.toString() === chipotleId
    );
  
    const alreadyLiked = (user.likedChipotles || []).some(
      (id) => id.toString() === chipotleId
    );
  
    if (alreadyDisliked) {
      return { disliked: "already" };
    }
  
    const update = {
      $addToSet: { dislikedChipotles: chipotleObjId },
    };
  
    if (alreadyLiked) {
      update.$pull = { likedChipotles: chipotleObjId };
    }
  
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      update
    );
  
    await chipotleCollection.updateOne(
      { _id: new ObjectId(chipotleId) },
      {
        $inc: {
          dislikes: 1,
          ...(alreadyLiked ? { likes: -1 } : {}),
        },
      }
    );
  
    return { disliked: "yes" };
  },
  async undislikeChipotle(userId, chipotleId) {
    userId = checkId(userId, "undislikeChipotle");
    chipotleId = checkId(chipotleId, "undislikeChipotle");
  
    const userCollection = await users();
    const chipotleCollection = await chipotles();
  
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  
    if (!user) {
      throw { status: 400, function: "undislikeChipotle", error: "User not found." };
    }
  
    const chipotleObjId = new ObjectId(chipotleId);
  
    const hasDisliked = (user.dislikedChipotles || []).some(
      (id) => id.toString() === chipotleId
    );
  
    if (!hasDisliked) {
      return { disliked: "already-none" };
    }
  
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { dislikedChipotles: chipotleObjId } }
    );
  
    await chipotleCollection.updateOne(
      { _id: new ObjectId(chipotleId) },
      { $inc: { dislikes: -1 } }
    );
  
    return { disliked: "no" };
  }

};

export default exportedMethods;
