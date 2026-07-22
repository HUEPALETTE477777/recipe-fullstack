import { Router } from 'express';
import { createRecipe, getAllRecipes, getRecipe, getMyRecipes, deleteRecipe } from '../controllers/RecipeController.js';
import { authenticate, canModifyRecipe } from '../middleware/Auth';
import multer from 'multer';
import { validateImageBytes } from '../middleware/ValidateImages.ts';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// STATIC PATHS FIRST
router.get('/', getAllRecipes);
router.get('/my-recipes', authenticate, getMyRecipes);

router.post('/create-recipe',
    authenticate,
    upload.any(),
    validateImageBytes(["coverImages", "stepImages_"]),
    createRecipe
);

// DYNAMIC PATHS LAST
router.get('/:id', getRecipe);
router.delete('/:id', authenticate, canModifyRecipe, deleteRecipe);

export default router;