import { checkUsername, checkPassword } from "../helpers.js";
import users from "../data/users.js";

const constructorMethod = (app) => {
  app.post("/login", async (req, res) => {
    let { username, password } = req.body;

    try {
      username = checkUsername(username, "login");
      password = checkPassword(password);

      let user = await users.login(username, password);

      req.session.user = user;

      return res.json({ loggedIn: "yes" });
    } catch (e) {
      return res.status(e.status).json({ loggedIn: "no" });
    }
  });

  app.post("/register", async (req, res) => {
    let { username, password } = req.body;
    try {
      username = checkUsername(username, "POST /register");
      password = checkPassword(password, "POST /register");
      let admin = false;
      let newUser = await users.createUser(username, password, admin);
      return res.json({registered: "yes"})
    } catch (e) {
      return res.status(e.status).json({registered: "no"});
    }
  });
};

export default constructorMethod;
