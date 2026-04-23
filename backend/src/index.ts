import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { requestLogger } from "./middleware/Logger.ts";

import recipeRoutes from "./routes/RecipeRoutes.ts"

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(requestLogger)

// ROUTES
app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON ${PORT}`);
});