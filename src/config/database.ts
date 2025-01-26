import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/models/*.ts"],
    synchronize: process.env.NODE_ENV === 'test',
    logging: false,
    poolSize: 10,
});

export async function closeDatabase() {
    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
}