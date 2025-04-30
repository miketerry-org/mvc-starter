// router.js

import express from "express";
import {
  getEnterEmailForm,
  postEnterEmailForm,
  postEnterCodeForm,
} from "./controller.js";

const router = express.Router();

// Define the /auth routes
router.get("/sign-in", getEnterEmailForm);
router.post("/sign-in", postEnterEmailForm);
router.post("/verify-code", postEnterCodeForm);

export default router;
