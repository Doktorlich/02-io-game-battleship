import { Router } from "express";
import { gameControllers } from "../controllers/game.controller";

const router = Router();

router.post("/", gameControllers.createGame); //Создать игру
// router.get("/available");                    //Список доступных игр
router.post("/:id/join", gameControllers.connectToGame); //Присоединиться к игре
// router.get("/:id");                          //Получить состояние игры
// router.delete("/:id");                       //Отменить игру (если стату `waiting`)
// router.post("/:id/surrender");               //Сдаться

export default router;
