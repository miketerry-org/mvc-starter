// router.js

import express from "express";
import { getSupportPage } from "./controller.js";

const router = express.Router();

// Define the /about route
router.get("/support", getSupportPage);

export default router;
