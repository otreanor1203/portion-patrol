import { chipotleData } from "../data/index.js";
import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const chipotleList = await chipotleData.getAllChipotles();
    return res.json(chipotleList);
  } catch (e) {
    return res.status(e.status).json({ error: e.error });
  }
});

router.get("/:chipotleId", async (req, res) => {
  const id = req.params.chipotleId;
    try {
        const chipotle = await chipotleData.getChipotleById(id);
        return res.json(chipotle);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

router.post("/", async (req, res) => {
  let { state, location, address, latitude, longitude } = req.body;
    try {
        const newChipotle = await chipotleData.createChipotle(state, location, address, latitude, longitude);
        return res.json(newChipotle);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

router.post("/:chipotleId/review", async (req, res) => {
    const chipotleId = req.params.chipotleId;
    const userId = req.session.user._id;
    const { rating, comment } = req.body;
    try {
        const result = await chipotleData.addRating(chipotleId, userId, parseInt(rating), comment);
        return res.json(result);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});


export default router;