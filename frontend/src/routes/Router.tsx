import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/home/HomePage'
import RecipeDetails from '../pages/recipe/RecipeDetails';
import CreateRecipe from '../pages/recipe/CreateRecipe';
import Login from '../pages/auth/Login';
import MyRecipes from '../pages/recipe/MyRecipes';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true, // DEFAULT CHILD ROUTE FOR PARENT
                element: <HomePage />,
            },
            {
                path: "recipe/:id",
                element: <RecipeDetails />,
            },
            {
                path: 'create',
                element: <CreateRecipe />,
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'my-recipes',
                element: <MyRecipes />
            }
        ],
    },
]);