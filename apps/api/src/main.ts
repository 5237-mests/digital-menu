import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { NextFunction, Request, Response } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './modules/app.module';
import { TenantContextService } from './modules/tenants/tenant-context.service';
import { TenantsService } from './modules/tenants/tenants.service';

const API_ROUTE_PATTERN =
  /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health|platform|setup|billing)(\/|$)/;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const tenantContext = app.get(TenantContextService);
  const tenantsService = app.get(TenantsService);
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
  app.use(async (req: Request, _res: Response, next: NextFunction) => {
    const host = ((req.headers.host ?? '').split(':')[0] ?? '').toLowerCase();
    const baseDomain = (process.env.BASE_DOMAIN ?? '').toLowerCase();
    const slug = baseDomain && host.endsWith(`.${baseDomain}`)
      ? host.slice(0, -(baseDomain.length + 1)).split('.')[0]
      : (process.env.DEFAULT_TENANT_SLUG ?? 'default');
    const tenant = await tenantsService.findBySlug(slug ?? 'default');
    if (tenant) tenantContext.run({ id: tenant.id, slug: tenant.slug, status: tenant.status }, next);
    else next();
  });

  const staticRoot = join(__dirname, '..', '..', 'web', 'build');
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
