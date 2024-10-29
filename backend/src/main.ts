import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Get DataSource from app
  const dataSource = app.get(DataSource);
  
  // Run migrations
  try {
    const pendingMigrations = await dataSource.showMigrations();
    if (pendingMigrations) {
      console.log('Running pending migrations...');
      await dataSource.runMigrations();
      console.log('Migrations completed successfully');
    } else {
      console.log('No pending migrations');
    }
  } catch (error) {
    console.error('Error running migrations:', error);
  }

  // Serve static files from public directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
