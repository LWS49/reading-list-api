import { AppDataSource, closeDatabase } from '../config/database';
import { DataSource } from 'typeorm';

export async function resetDatabase(dataSource: DataSource) {
    const entities = dataSource.entityMetadatas;

    // Disable foreign key checks for PostgreSQL
    await dataSource.query('SET session_replication_role = replica;');

    // Truncate tables in reverse order of their dependencies
    for (const entity of entities) {
        await dataSource.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }

    // Re-enable foreign key checks
    await dataSource.query('SET session_replication_role = origin;');
}
