// // // import { ValidationPipe } from '@nestjs/common';
// // // import { NestFactory } from '@nestjs/core';
// // // import { NestExpressApplication } from '@nestjs/platform-express';
// // // import { IoAdapter } from '@nestjs/platform-socket.io';
// // // import type { NextFunction, Request, Response } from 'express';
// // // import { existsSync, mkdirSync } from 'node:fs';
// // // import { join } from 'node:path';
// // // import { AppModule } from './modules/app.module';

// // // const API_ROUTE_PATTERN =
// // //   /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health)(\/|$)/;

// // // async function bootstrap(): Promise<void> {
// // //   const app = await NestFactory.create<NestExpressApplication>(AppModule);
// // //   app.useWebSocketAdapter(new IoAdapter(app));
// // //   app.enableCors({
// // //     origin: true,
// // //     credentials: true
// // //   });
// // //   app.useGlobalPipes(
// // //     new ValidationPipe({
// // //       whitelist: true,
// // //       forbidNonWhitelisted: true,
// // //       transform: true
// // //     })
// // //   );

// // //   const staticRoot = join(__dirname, '..', '..', 'web', 'build');
// // //   const uploadRoot = join(__dirname, 'uploads');
// // //   try {
// // //     if (!existsSync(uploadRoot)) {
// // //       mkdirSync(uploadRoot, { recursive: true });
// // //     }
// // //     app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });
// // //   } catch (err) {
// // //     // In some deployment environments (read-only file systems) creating
// // //     // the uploads folder will fail — log a warning and continue so the
// // //     // server can still start without crashing.
// // //     // eslint-disable-next-line no-console
// // //     console.warn('Could not create or serve uploads directory:', err);
// // //   }

// // //   if (existsSync(staticRoot)) {
// // //     app.useStaticAssets(staticRoot, { index: false });
// // //     app.use((req: Request, res: Response, next: NextFunction) => {
// // //       if (req.method !== 'GET' || API_ROUTE_PATTERN.test(req.path)) {
// // //         next();
// // //         return;
// // //       }

// // //       res.sendFile(join(staticRoot, 'index.html'));
// // //     });
// // //   }

// // //   const port = Number(process.env.API_PORT ?? 3001);
// // //   await app.listen(port);
// // // }

// // // void bootstrap();


// // import { ValidationPipe } from '@nestjs/common';
// // import { NestFactory } from '@nestjs/core';
// // import { NestExpressApplication } from '@nestjs/platform-express';
// // import { IoAdapter } from '@nestjs/platform-socket.io';
// // import type { NextFunction, Request, Response } from 'express';
// // import { existsSync, mkdirSync } from 'node:fs';
// // import { extname, join } from 'node:path';
// // import { AppModule } from './modules/app.module';

// // const API_ROUTE_PATTERN =
// //   /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health)(\/|$)/;

// // async function bootstrap(): Promise<void> {
// //   const app = await NestFactory.create<NestExpressApplication>(AppModule);
// //   app.useWebSocketAdapter(new IoAdapter(app));

// //   app.enableCors({
// //     origin: true,
// //     credentials: true
// //   });

// //   app.useGlobalPipes(
// //     new ValidationPipe({
// //       whitelist: true,
// //       forbidNonWhitelisted: true,
// //       transform: true
// //     })
// //   );

// //   const staticRoot = join(__dirname, '..', '..', 'web', 'build');
// //   const uploadRoot = join(__dirname, 'uploads');

// //   // Uploads
// //   try {
// //     if (!existsSync(uploadRoot)) {
// //       mkdirSync(uploadRoot, { recursive: true });
// //     }
// //     app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });
// //   } catch (err) {
// //     console.warn('Could not create uploads directory:', err);
// //   }

// //   // Static frontend + SPA fallback (SAFE version)
// //   if (existsSync(staticRoot)) {
// //     app.useStaticAssets(staticRoot, { index: false });

// //     app.use((req: Request, res: Response, next: NextFunction) => {
// //       // Skip API routes, non-GET, and files with extensions (.js, .css, .png...)
// //       if (
// //         req.method !== 'GET' ||
// //         API_ROUTE_PATTERN.test(req.path) ||
// //         extname(req.path) !== ''           // ← This was missing!
// //       ) {
// //         return next();
// //       }

// //       res.sendFile(join(staticRoot, 'index.html'));
// //     });
// //   }

// //   const port = Number(process.env.API_PORT ?? 3001);
// //   await app.listen(port);
// //   console.log(`🚀 Server running on port ${port}`);
// // }

// // void bootstrap();

// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import type { NextFunction, Request, Response } from 'express';
// import { existsSync, mkdirSync } from 'node:fs';
// import { extname, join } from 'node:path';
// import { AppModule } from './modules/app.module';

// const API_ROUTE_PATTERN =
//   /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health)(\/|$)/;

// async function bootstrap(): Promise<void> {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   app.useWebSocketAdapter(new IoAdapter(app));

//   app.enableCors({
//     origin: true,
//     credentials: true
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true
//     })
//   );

//   // === Uploads Folder (Important for cPanel) ===
//   const uploadRoot = join(__dirname, 'uploads');        // or use process.cwd()
//   try {
//     if (!existsSync(uploadRoot)) {
//       mkdirSync(uploadRoot, { recursive: true, mode: 0o755 });
//     }
//     app.useStaticAssets(uploadRoot, {
//       prefix: '/uploads/',
//       index: false
//     });
//     console.log('✅ Uploads directory ready');
//   } catch (err) {
//     console.warn('⚠️ Could not create uploads directory:', err);
//   }

//   // === Static Frontend + SPA Fallback ===
//   const staticRoot = join(__dirname, '..', '..', 'web', 'build');

//   if (existsSync(staticRoot)) {
//     app.useStaticAssets(staticRoot, { index: false });

//     app.use((req: Request, res: Response, next: NextFunction) => {
//       if (
//         req.method !== 'GET' ||
//         API_ROUTE_PATTERN.test(req.path) ||
//         extname(req.path) !== ''        // Important: skip .js, .css, images, etc.
//       ) {
//         return next();
//       }
//       res.sendFile(join(staticRoot, 'index.html'));
//     });
//   } else {
//     console.warn('⚠️ Frontend build not found at:', staticRoot);
//   }

//   const port = Number(process.env.API_PORT ?? 3001);
//   await app.listen(port);
//   console.log(`🚀 Server running on port ${port}`);
// }

// void bootstrap();


import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { NextFunction, Request, Response } from 'express';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { AppModule } from './modules/app.module';

const API_ROUTE_PATTERN = /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health)(\/|$)/;

async function bootstrap(): Promise<void> {
  try {
    console.log('🚀 Starting NestJS...');

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useWebSocketAdapter(new IoAdapter(app));
    app.enableCors({ origin: true, credentials: true });

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }));

    // ====================== UPLOADS (Matching Express) ======================
    const homeDir = '/home/hypertxj';
    const uploadRoot = join(homeDir, 'uploads', 'products');

    try {
      if (!existsSync(uploadRoot)) {
        mkdirSync(uploadRoot, { recursive: true, mode: 0o755 });
      }
      app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });
      console.log('✅ Uploads ready:', uploadRoot);
    } catch (err: any) {
      console.error('❌ Uploads folder error:', err.message);
    }

    // ====================== FRONTEND SPA ======================
    const staticRoot = join(__dirname, '..', '..', 'web', 'build');

    if (existsSync(staticRoot)) {
      app.useStaticAssets(staticRoot, { index: false });

      app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET' || API_ROUTE_PATTERN.test(req.path) || extname(req.path) !== '') {
          return next();
        }
        res.sendFile(join(staticRoot, 'index.html'));
      });
    }

    const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
    await app.listen(port);
    console.log(`✅ Server running on port ${port}`);
  } catch (error: any) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
}

void bootstrap();
