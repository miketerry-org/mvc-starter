// router.js

import express from "express";
import { getContactPage } from "./controller.js";

const router = express.Router();

// Define the /contact route
router.get("/contact", getContactPage);

export default router;
