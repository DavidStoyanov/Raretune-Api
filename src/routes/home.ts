import { Request, Response } from "express";

export const homeRoute = (req: Request, res: Response) => {
    res.send("Welcome to the Home Route!");
};
