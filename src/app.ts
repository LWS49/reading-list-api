import express from 'express';
import AppDataSource from "./config/database";
import authRoutes from './routes/auth.routes';

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database Connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        app.listen(4000, () => {
            console.log('Server running on port 4000');
        });
    })
    .catch((error) => console.log(error));