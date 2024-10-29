import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  try {
    // Create admin user if it doesn't exist
    const adminEmail = 'admin@example.com';
    const existingUser = await userService.findByEmail(adminEmail);

    if (!existingUser) {
      await userService.create(adminEmail, 'admin123');
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
