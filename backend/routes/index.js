import { checkUsername, checkPassword } from "../helpers.js";
import users from "../data/users.js";
import userRoutes from "./users.js";
import chipotleRoutes from "./chipotles.js";

const constructorMethod = (app) => {
  app.post("/login", async (req, res) => {
    let { username, password } = req.body;

    try {
      username = checkUsername(username, "login");
      password = checkPassword(password);

      let user = await users.login(username, password);

      req.session.user = user;
      console.log(req.session.user);

      return res.json({ loggedIn: "yes" });
    } catch (e) {
      return res.status(e.status || 500).json({
        error: e.error || "Login failed",
      });
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
      return res.status(e.status || 500).json({
        error: e.error || "Registration failed",
      });
    }
  });

  app.post("/signout", async (req, res) => {
    req.session.destroy();
    return res.json({ loggedIn: "no" });
  });

  app.use("/users", userRoutes);
  app.use("/chipotles", chipotleRoutes);
    app.use("*", (req, res) => {
      res.status(404).json({ error: "Route Not found" });
    });

};

export default constructorMethod;
