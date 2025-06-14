import User from "../models/user.model";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../@types/custom";
import { validateEnv } from "../config/env";
import { validateUser, generateTokens } from "../services/auth.service";
import Game from "../models/game.model";
import { validateUserGame } from "../services/game.service";

async function createGame(req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.cookies.accessToken;
        const user = await validateUserGame(accessToken);
        const newGame = new Game({ player1: user._id });
        user.activeGame = newGame._id;

        await newGame.save();
        await user.save();
        res.status(200).json({ message: "Create new game" });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
            console.log("createGame error:", error);
        }
        console.log("createGame error:", error);
        next(error);
    }
}
async function connectToGame(req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.cookies.accessToken;
        const user = await validateUserGame(accessToken);
        const game = await Game.findById(req.body.gameId).populate("player1", "_id");
        if (!game) {
            const error = new Error("No active game found") as CustomError;
            error.statusCode = 403;
            throw error;
        }

        if (game.player1._id.toString() === user._id.toString()) {
            const error = new Error("You cannot join as a second player in your own created game") as CustomError;
            error.statusCode = 403;
            throw error;
        }
        game.player2 = user._id;
        await game.save();

        user.activeGame = game._id;
        await user.save();
        res.status(200).json({ message: "User 2 successfully connect to game.", gameP: game.player1._id.toString(), p1: user.activeGame.toString() });
    } catch (error: any) {
        if (!error.statusCode) {
            error.statusCode = 500;
            console.log("connectToGame error:", error);
        }
        console.log("connectToGame error:", error);
        next(error);
    }
}

export const gameControllers = {
    createGame,
    connectToGame,
};
