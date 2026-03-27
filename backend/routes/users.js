import { userData } from "../data/index.js";
import { Router } from "express";
const router = Router();

router.get("/:userId", async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await userData.getUserById(id);
    return res.json(user);
  } catch (e) {
    return res.status(e.status).json({ error: e.error });
  }
});

router.post("/like/:chipotleId", async (req, res) => {
  const userId = req.session.user._id;
  const chipotleId = req.params.chipotleId;
    try {
        const result = await userData.likeChipotle(userId, chipotleId);
        return res.json(result);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

router.post("/unlike/:chipotleId", async (req, res) => {
  const userId = req.session.user._id;
  const chipotleId = req.params.chipotleId;
    try {
        const result = await userData.unlikeChipotle(userId, chipotleId);
        return res.json(result);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

router.post("/dislike/:chipotleId", async (req, res) => {
  const userId = req.session.user._id;
  const chipotleId = req.params.chipotleId;
    try {
        const result = await userData.dislikeChipotle(userId, chipotleId);
        return res.json(result);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

router.post("/undislike/:chipotleId", async (req, res) => {
  const userId = req.session.user._id;
  const chipotleId = req.params.chipotleId;
    try {
        const result = await userData.undislikeChipotle(userId, chipotleId);
        return res.json(result);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

export default router;