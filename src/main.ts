import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // or "app.enableVersioning()"
  app.enableVersioning({ type: VersioningType.URI });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('VtopAcademy API')
    .setDescription('The VtopAcademy API provides the all needed endpoints')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
