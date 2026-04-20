import { chipotleData, userData } from "../data/index.js";
import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const chipotles = await chipotleData.getAllChipotles();
    const userId = req.session?.user?._id;

    if (userId) {

      console.log("heeere" + userId)
      
      const user = await userData.getUserById(userId);
      const likedSet = new Set(
        (user.likedChipotles || []).map(id => id.toString())
      );
      
      const dislikedSet = new Set(
        (user.dislikedChipotles || []).map(id => id.toString())
      );

      const withLikes = chipotles.map(chip => ({
        ...chip,
        userLiked: likedSet.has(chip._id.toString()),
        userDisliked: dislikedSet.has(chip._id.toString()),
      }));

      console.log(withLikes[0])

      return res.json(withLikes);
    } 

    return res.json(chipotles);
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.error });
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
  let { id, state, location, address } = req.body;
    try {
        const newChipotle = await chipotleData.createChipotle(id, state, location, address);
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