import express, { Request, Response } from 'express';
import { AppDataSource } from "./config/database";
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes'
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Logging middleware to track all requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.path}`);
    next();
});

app.use(express.json());

// Test route for debugging
app.get('/test', (req: Request, res: Response) => {
    res.send('Test route');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Catch-all route to log unhandled routes
app.use((req, res, next) => {
    console.log('Unhandled route:', req.path);
    next();
});

// Error handling middleware should be last
app.use(errorHandler);

console.log("Registered routes:");
app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
        console.log(`Path: ${r.route.path}`);
    }
});


// Database Connection
// Database Connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        // Check if not in test environment before starting the server
        if (process.env.NODE_ENV !== 'test') {
            app.listen(3000, () => {
                console.log('Server running on port 3000');
            });
        }
    })
    .catch((error) => console.log(error));

export default app;