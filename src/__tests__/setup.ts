// __tests__/setup.ts
import AppDataSource from '../config/database';
import { DataSource } from 'typeorm';

// Custom database reset function
export async function resetDatabase(dataSource: DataSource) {
    const entities = dataSource.entityMetadatas;

    // Disable foreign key checks
    await dataSource.query('PRAGMA foreign_keys = OFF;');

    // Clear tables in reverse order of their dependencies
    for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.query(`DELETE FROM "${entity.tableName}"`);
    }

    // Re-enable foreign key checks
    await dataSource.query('PRAGMA foreign_keys = ON;');
}

// Global setup for Jest
export default async () => {
    // Ensure database connection
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
};

// Global teardown for Jest
export const teardown = async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
};