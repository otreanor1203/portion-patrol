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

  async getTakenUsernames() {
    let userList = await this.getAllUsers();

    let usernames = userList.map((user) => user.username.toLowerCase());

    return usernames;
  },
};

export default exportedMethods;
