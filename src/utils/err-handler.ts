import { Request, Response, /*NextFunction*/ } from "express";

export class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function errorHandler(
    err: HttpError,
    req: Request,
    res: Response,
    //next: NextFunction
) {
    const status = err.status || 500;

    res.status(status).json({
        status,
        message: err.message,
    });

    if (err.status === 333) {
        res.status(333)
            .json({ message: 'ErrorHandler: not allowed!' })
    } else {
        console.error(err.stack)
        // console.log(err)
        res.status(500)
            .json({ message: 'ErrorHandler: Something went wrong!', err })
    }
}
