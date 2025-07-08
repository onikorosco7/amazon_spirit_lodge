import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { GlobalAuthGuard } from './auth/global-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/pdfs', express.static(join(__dirname, '..', 'public', 'pdfs')));
  app.use('/galeria', express.static(join(__dirname, '..', 'public', 'galeria')));

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Amazon Spirit Lodge API')
    .setDescription('Documentación del backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new GlobalAuthGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
