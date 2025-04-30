// router.js

import express from "express";
import { getAboutPage } from "./controller.js";

const router = express.Router();

// Define the /about route
router.get("/about", getAboutPage);

export default router;
