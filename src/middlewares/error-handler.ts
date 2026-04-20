import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
    status?: number;
}

export class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error(err);

    if (err.status === 333) {
        res.status(333)
            .json({ message: 'Not Allowed!' })
    } else {
        console.error(err.stack)
        // console.log(err)
        res.status(500)
            .json({ message: 'Internal Server Error!', err })
    }
}
