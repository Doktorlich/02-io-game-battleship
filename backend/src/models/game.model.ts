import { Schema, model } from "mongoose";
interface Ship {
    x: number;
    y: number;
    size: number;
    direction: "horizontal" | "vertical";
    hits: number; // сколько попаданий
}

interface Board {
    ships: Ship[];
    shots: Array<{ x: number; y: number }>; // координаты выстрелов
}
const game = new Schema({
    player1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    player2: { type: Schema.Types.ObjectId, ref: "User", required: true },

    currentTurn: { type: Boolean, required: true, default: true },
    board1: {
        ships: [
            {
                x: Number,
                y: Number,
                size: Number,
                direction: String,
                hits: Number,
            },
        ],
        shots: [{ x: Number, y: Number }],
    },
    board2: {
        ships: [
            {
                x: Number,
                y: Number,
                size: Number,
                direction: String,
                hits: Number,
            },
        ],
        shots: [{ x: Number, y: Number }],
    },
    winner: { type: Boolean },
    status: {
        type: String,
        required: true,
        enum: ["waiting", "playing", "finished"],
        default: "waiting",
    },
});

export default model("Game", game);
