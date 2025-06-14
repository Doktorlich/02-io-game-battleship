import { Router } from "express";
import { authControllers } from "../controllers/auth.controller";
import { registerValidator } from "../validators/auth.validator";
import { isAuth } from "../middlewares/is-auth";

const router = Router();

// router.get("/register-form", );
// router.get("/login-form");
// router.get("/me");
router.post("/register", registerValidator, authControllers.postRegister);

router.post("/login", authControllers.postLogin);

router.post("/refresh", isAuth, authControllers.postRefresh);

router.post("/logout", isAuth, authControllers.postLogout);

export default router;
