// router.js

import express from "express";
import { getHomePage } from "./controller.js";

const router = express.Router();

// Define the /home route
router.get("/", getHomePage);

export default router;
