import { Router } from "express";
import { linkProfile } from "../controllers/platformProfile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/link", verifyJWT, linkProfile);

export default router;
