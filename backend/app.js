import express from "express";
import session from "express-session";
import configRoutesFunction from "./routes/index.js";
import cors from "cors";
import pkg from "lusca";

const app = express();
app.use(express.json());
const { csrf } = pkg;
const isProduction = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_CORS_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:80",
  "http://127.0.0.1:80",
  "http://localhost",
  "http://127.0.0.1",
];
const CORS_ORIGINS = (process.env.CORS_ORIGIN || DEFAULT_CORS_ORIGINS.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const SESSION_SECRET = process.env.SESSION_SECRET || "demo-session-secret";

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CORS_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(
  session({
    name: "AuthenticationState",
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
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

app.get("/csrf-token", (req, res) => {
  return res.json({ csrfToken: req.csrfToken() });
});

app.use("/getSession", async (req, res, next) => {
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.json({ user: null });
  }
});

app.use("/ping", async (req, res, next) => {
  console.log(req.session.user);
  next();
});

configRoutesFunction(app);

app.listen(PORT, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${PORT}`);
});
