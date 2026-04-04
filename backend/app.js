import express from "express";
import session from "express-session";
import configRoutesFunction from "./routes/index.js";
import cors from "cors";
import { csrf } from "lusca";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    name: "AuthenticationState",
    secret: "some secret string!",
    saveUninitialized: false,
    resave: false,
  }),
);

app.use(csrf());

app.use(async (req, res, next) => {
  let auth = "";
  if (req.session.user) {
    if (req.session.user.admin) auth = "(Authenticated Admin)";
    else {
      auth = "(Authenticated User)";
    }
  } else {
    auth = "(Non-Authenticated)";
  }
  console.log(
    "[" +
      new Date().toUTCString() +
      "]: " +
      req.method +
      " " +
      req.path +
      " " +
      auth,
  );
  next();
});

app.use("/getSession", async (req, res, next) => {
  if (req.session.user) {
    console.log("Yes");
    return res.json(req.session.user);
  } else {
    console.log("No");
    return res.json({ user: null });
  }
});

app.use("/ping", async (req, res, next) => {
  console.log(req.session.user);
  next();
});

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
