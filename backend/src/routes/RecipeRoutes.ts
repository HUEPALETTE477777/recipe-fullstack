import { Router } from 'express';
import { createRecipe, getAllRecipes, getRecipe, getMyRecipes } from '../controllers/RecipeController.js';
import { authenticate, authorize } from '../middleware/Auth';

const router = Router();

// PUBLIC FOR JIT NOT LOGGED In
router.get('/', getAllRecipes);
router.get('/my-recipes', authenticate, getMyRecipes)
router.get('/:id', getRecipe)

// ONLY FOR LOGGED IN USERS
router.post('/create-recipe', authenticate, createRecipe);

// ADMIN ONLY
// router.delete('/:id', authenticate, authorize('admin'), deleteRecipe);

export default router;