import express from 'express';
import AppDataSource from "./config/database";
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware should be last
app.use(errorHandler);

// Database Connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((error) => console.log(error));