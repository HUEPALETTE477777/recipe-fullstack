import { Request, Response } from "express";
import { AuthRequest } from '../middleware/Auth';
type AuthMulterRequest = AuthRequest & {
    files?: {
        [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[];
};
export declare const getAllRecipes: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyRecipes: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRecipe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createRecipe: (req: AuthMulterRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteRecipe: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const searchRecipes: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=RecipeController.d.ts.map