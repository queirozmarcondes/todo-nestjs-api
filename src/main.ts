import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Permite qualquer origem

  const config = new DocumentBuilder()
    .setTitle('Tasks API Management')
    .setDescription('The tasks API management')
    .setVersion('1.0')
    .addTag('tasks')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Informe o token JWT no formato: Bearer <token>',
        in: 'header',
      },
      'access-token', // nome usado no @ApiBearerAuth('access-token')
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs/v1', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
