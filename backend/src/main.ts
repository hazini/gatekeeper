import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose']
  });
  
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

  // Configure static file serving
  const publicPath = join(__dirname, '..', 'public');
  console.log('Serving static files from:', publicPath);
  
  app.useStaticAssets(publicPath, {
    index: false,
    prefix: '/'
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  await app.listen(3000, () => {
    console.log('Application is running on: http://localhost:3000');
  });
}
bootstrap();
