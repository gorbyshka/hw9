import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { UserModule } from './module/user.module';

async function bootstrap() {
  
  const app = await NestFactory.create(UserModule );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);

}

bootstrap();
