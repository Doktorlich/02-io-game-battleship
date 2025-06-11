import { Router } from "express";
import usersRouter from "./users.routes";
import gamesRoutes from "./games.routes";
import authRoutes from "./auth.routes";
const router = Router();

router.use("/users", usersRouter);
router.use("/games", gamesRoutes);
router.use("/auth", authRoutes);

export default router;
