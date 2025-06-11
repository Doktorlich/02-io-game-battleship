import express from "express";
import { applyEnv } from "./config/env";
import { corsMiddleware } from "./config/cors";
import { loggerMorgan } from "./config/logger";
import { securityHelmet } from "./config/security";
import {
    globalErrorHandler,
    notFoundHandler,
    registerProcessEvents,
} from "./config/error-handlers";
import { globalPathPublic } from "./config/static";
import { cookiePars } from "./config/cookie";
import indexRouter from "./routes/index.routes";

const app = express();
// экспресс боди парсер
//Ограничение размера тела запроса
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
//middleware для логирования:
app.use(loggerMorgan);
//Защита от распространенных уязвимостей:
app.use(securityHelmet);
// установка CORS  заголовков
//  явно указанные домены:
app.use(corsMiddleware);
//process.on handlers
registerProcessEvents();
// извелчение файлов из куки
app.use(cookiePars);
//шлобальный путь к публичным файлам
app.use(globalPathPublic);

app.use(indexRouter);
// app.use((req, res, next) => {
//     res.send("Some text");
// });
// перехватчик ошибок

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
