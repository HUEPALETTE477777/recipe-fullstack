import { Router } from 'express';
import { createRecipe, getAllRecipes, getRecipe, getMyRecipes, deleteRecipe } from '../controllers/RecipeController.js';
import { authenticate, authorize } from '../middleware/Auth';

const router = Router();

// PUBLIC FOR JIT NOT LOGGED In
router.get('/', getAllRecipes);
router.get('/my-recipes', authenticate, getMyRecipes)
router.get('/:id', getRecipe)

// ONLY FOR LOGGED IN USERS
router.post('/create-recipe', authenticate, createRecipe);

// DELETING FOR ADMIN OR OWNER OF RECIPE
// router.delete('/:id', authenticate, authorize('admin'), deleteRecipe);
router.delete('/:id', authenticate, deleteRecipe);

export default router;