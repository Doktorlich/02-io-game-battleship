import path from "path";
import express from "express";
export const globalPathPublic = express.static(path.join(__dirname, "public"));
