import { Router } from "express";
import { authControllers } from "../controllers/auth.controller";
import { registerValidator } from "../validators/auth.validator";

const router = Router();

router.post("/register", registerValidator, authControllers.postRegister);
// router.get("/register-form", );

// router.get("/login-form");
router.post("/login", authControllers.postLogin);

// router.post("/refresh");

router.post("/logout", authControllers.postLogout);

// router.get("/me");

export default router;
