import { Schema, model } from "mongoose";

const user = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    activeGame: { type: Schema.Types.ObjectId, ref: "Game" },
    rating: { type: Number, default: 0, required: true },
    wins: { type: Number, default: 0, required: true },
    losses: { type: Number, default: 0 , required: true},
});

export default model("User", user);
