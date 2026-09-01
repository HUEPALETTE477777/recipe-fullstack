import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { requestLogger } from "./middleware/Logger.js";
import recipeRoutes from "./routes/RecipeRoutes.js";
dotenv.config();
const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS error: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(requestLogger);
// ROUTES
app.use('/api/recipes', recipeRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON ${PORT}`);
});
//# sourceMappingURL=index.js.map