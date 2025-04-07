import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // main.ts
app.enableVersioning({
  type: VersioningType.URI, // or HEADER, CUSTOM, etc.
});
await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
