import { Request, Response, NextFunction } from 'express';

// shid jeet
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
};