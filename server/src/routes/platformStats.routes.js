import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  syncCodechefStats,
  syncCodeforcesStats,
  syncLeetcodeStats,
} from "../controllers/platformStats.controller.js";
import { getMyStats } from "../controllers/platformStats.controller.js";

const router = Router();

router.post("/sync/codeforces", verifyJWT, syncCodeforcesStats);

router.post("/sync/leetcode", verifyJWT, syncLeetcodeStats);

router.post("/sync/codechef", verifyJWT, syncCodechefStats);

router.get("/me", verifyJWT, getMyStats);

export default router;
