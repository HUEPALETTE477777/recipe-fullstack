import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.split(' ')[1];

    try {
        // ASK SUPABASE TO VERIFY THE JWT TOKEN SENT FROM FRONTEND
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: "INVALID OR EXPIRED TOKEN" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: "INTERNAL AUTH ERROR" });
    }
}

export const authorize = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        
        // SUPBASE STORES IT IN user_metadata OR SEPARATE PROFILES TABLE
        const userRole = user.app_metadata?.role || 'user'; 

        if (userRole !== requiredRole) {
            return res.status(403).json({ message: "FORBIDDEN, UNAUTHORIZED IMMIGRANT" });
        }
        next();
    };
}