import { createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

export async function initializeDatabase() {
  const configService = new ConfigService();
  const dbName = configService.get('DB_DATABASE');

  // Connect to postgres to create database if it doesn't exist
  const client = new Client({
    user: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT'), 10),
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    
    // Check if database exists
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rows.length === 0) {
      // Create database if it doesn't exist
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  } finally {
    await client.end();
  }
}
