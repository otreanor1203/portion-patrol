import { requestsData } from "../data/index.js";
import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
    try {
        const requestList = await requestsData.getAllRequests();
        return res.json(requestList);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

router.post("/", async (req, res) => {
    const userId = req.session.user._id;
    const { state, location, address } = req.body;
    try {        const result = await requestsData.addRequest(userId, state, location, address);
        return res.json(result);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

router.delete("/:requestId", async (req, res) => {
    const requestId = req.params.requestId;
    try {
        const result = await requestsData.deleteRequest(requestId);
        return res.json(result);
    } catch (e) {
        return res.status(e.status).json({ error: e.error });
    }
});

export default router;
