import request from 'supertest';
import { AppDataSource, closeDatabase } from '../config/database';
import app from '../app';
import { resetDatabase } from './setup';
import http from 'http';

let server: http.Server;

describe('Authentication Endpoints', () => {
    jest.setTimeout(20000); // Increase timeout to allow for database and server cleanup in code
    beforeAll(async () => {
        // Ensure database is initialized
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Start the server before the tests
        server = app.listen(0);  // Use port 0 to let the OS assign an available port
    });

    beforeEach(async () => {
        // Reset database before each test
        await resetDatabase(AppDataSource);
    });

    afterAll(async () => {
        await closeDatabase();
        server.close();
        await new Promise<void>(resolve => setTimeout(() => resolve(), 15000)); // Increase timeout to allow for database and server cleanup in code
    });

    it('should register a new user', async () => {
        const response = await request(server)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'User created');
    });

    it('should not register user with existing email', async () => {
        // First registration
        await request(server)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        // Second registration with same email
        const response = await request(server)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(409);
    });
});