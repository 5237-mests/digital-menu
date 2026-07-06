import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { NextFunction, Request, Response } from 'express';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './modules/app.module';

const API_ROUTE_PATTERN =
  /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health)(\/|$)/;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors({
    origin: true,
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const staticRoot = join(__dirname, '..', '..', 'web', 'build');
  const uploadRoot = join(__dirname, 'uploads');
  try {
    if (!existsSync(uploadRoot)) {
      mkdirSync(uploadRoot, { recursive: true });
    }
    app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });
  } catch (err) {
    // In some deployment environments (read-only file systems) creating
    // the uploads folder will fail — log a warning and continue so the
    // server can still start without crashing.
    // eslint-disable-next-line no-console
    console.warn('Could not create or serve uploads directory:', err);
  }

  if (existsSync(staticRoot)) {
    app.useStaticAssets(staticRoot, { index: false });
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' || API_ROUTE_PATTERN.test(req.path)) {
        next();
        return;
      }

      res.sendFile(join(staticRoot, 'index.html'));
    });
  }

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
