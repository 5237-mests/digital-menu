"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const app_module_1 = require("./modules/app.module");
const API_ROUTE_PATTERN = /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health)(\/|$)/;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.enableCors({
        origin: true,
        credentials: true
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    const staticRoot = (0, node_path_1.join)(__dirname, '..', '..', 'web', 'build');
    if ((0, node_fs_1.existsSync)(staticRoot)) {
        app.useStaticAssets(staticRoot, { index: false });
        app.use((req, res, next) => {
            if (req.method !== 'GET' || API_ROUTE_PATTERN.test(req.path)) {
                next();
                return;
            }
            res.sendFile((0, node_path_1.join)(staticRoot, 'index.html'));
        });
    }
    const port = Number(process.env.API_PORT ?? 3001);
    await app.listen(port);
}
void bootstrap();
// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import type { NextFunction, Request, Response } from 'express';
// import { existsSync, mkdirSync } from 'node:fs';
// import { extname, join } from 'node:path';
// import { AppModule } from './modules/app.module';
// const API_ROUTE_PATTERN = /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health)(\/|$)/;
// async function bootstrap(): Promise<void> {
//   try {
//     console.log('🚀 Starting NestJS...');
//     const app = await NestFactory.create<NestExpressApplication>(AppModule);
//     app.useWebSocketAdapter(new IoAdapter(app));
//     app.enableCors({ origin: true, credentials: true });
//     app.useGlobalPipes(new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true
//     }));
//     // ====================== UPLOADS (Matching Express) ======================
//     const homeDir = '/home/hypertxj';
//     const uploadRoot = join(homeDir, 'uploads', 'products');
//     try {
//       if (!existsSync(uploadRoot)) {
//         mkdirSync(uploadRoot, { recursive: true, mode: 0o755 });
//       }
//       app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });
//       console.log('✅ Uploads ready:', uploadRoot);
//     } catch (err: any) {
//       console.error('❌ Uploads folder error:', err.message);
//     }
//     // ====================== FRONTEND SPA ======================
//     const staticRoot = join(__dirname, '..', '..', 'web', 'build');
//     if (existsSync(staticRoot)) {
//       app.useStaticAssets(staticRoot, { index: false });
//       app.use((req: Request, res: Response, next: NextFunction) => {
//         if (req.method !== 'GET' || API_ROUTE_PATTERN.test(req.path) || extname(req.path) !== '') {
//           return next();
//         }
//         res.sendFile(join(staticRoot, 'index.html'));
//       });
//     }
//     const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
//     await app.listen(port);
//     console.log(`✅ Server running on port ${port}`);
//   } catch (error: any) {
//     console.error('❌ Startup failed:', error.message);
//     process.exit(1);
//   }
// }
// void bootstrap();
