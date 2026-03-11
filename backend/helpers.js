import { ObjectId } from "mongodb";

const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const LETTERS_AND_NUMBERS_PLUS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";

const checkString = (str, varName, funcName) => {
  if (str === undefined || str === null) {
    throw {
      status: 400,
      function: funcName,
      error: `${varName} is undefined.`,
    };
  }

  if (typeof str !== "string") {
    throw {
      status: 400,
      function: funcName,
      error: `${varName} must be a string.`,
    };
  }

  str = str.trim();

  if (str.length === 0) {
    throw {
      status: 400,
      function: funcName,
      error: `${varName} cannot be an empty string or a string that contains only spaces.`,
    };
  }

  return str;
};

const checkId = (id, funcName, id_of_what) => {
  id = checkString(id, "id", funcName);

  if (!ObjectId.isValid(id)) {
    throw {
      status: 400,
      function: funcName,
      error: `Invalid ${id_of_what} ID.`,
    };
  }

  return id;
};

const checkUsername = (username, funcName) => {
  username = checkString(username, "Username", funcName);

  if (username.length < 3 || username.length > 15) {
    throw {
      status: 400,
      function: funcName,
      error: "Username must be between 3-15 characters long.",
    };
  }

  for (let char of username) {
    if (LETTERS_AND_NUMBERS_PLUS.indexOf(char) < 0) {
      throw {
        status: 400,
        function: funcName,
        error:
          "Invalid username: Username should contain only letters, numbers, underscores, periods, and hyphens.",
      };
    }
  }

  if (username[0] === "." || username[username.length - 1] === ".") {
    throw {
      status: 400,
      function: funcName,
      error: "Username cannot start or end with a period.",
    };
  }

  return username;
};

const checkPassword = (password, funcName) => {
  checkString(password, "Password", funcName);

  if (password.length < 8) {
    throw {
      status: 400,
      function: funcName,
      error: "Password must be at least 8 characters long.",
    };
  }

  const characters = {
    upper: 0,
    lower: 0,
    number: 0,
    special: 0,
  };

  for (let char of password) {
    if (UPPERCASE_LETTERS.indexOf(char) > -1) {
      characters.upper++;
    } else if (LOWERCASE_LETTERS.indexOf(char) > -1) {
      characters.lower++;
    } else if (NUMBERS.indexOf(char) > -1) {
      characters.number++;
    } else {
      if (" ".indexOf(char) > -1) {
        throw {
          status: 400,
          function: funcName,
          error: "Password cannot have spaces.",
        };
      }
      characters.special++;
    }
  }

  if (
    characters["lower"] === 0 ||
    characters["upper"] === 0 ||
    characters["special"] === 0 ||
    characters["number"] === 0
  ) {
    throw {
      status: 400,
      function: funcName,
      error:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    };
  }

  return password;
};

const checkAdmin = (admin, funcName) => {
  if (admin === undefined || admin === null) {
    throw {
      status: 400,
      function: funcName,
      error: "Admin is undefined.",
    };
  }

  if (typeof admin !== "boolean") {
    throw {
      status: 400,
      function: funcName,
      error: "Admin must be a boolean.",
    };
  }

  return admin;
};

export {
  checkString,
  checkUsername,
  checkPassword,
  checkId,
  checkAdmin
};
