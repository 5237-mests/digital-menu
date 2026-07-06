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
    const uploadRoot = (0, node_path_1.join)(__dirname, 'uploads');
    try {
        if (!(0, node_fs_1.existsSync)(uploadRoot)) {
            (0, node_fs_1.mkdirSync)(uploadRoot, { recursive: true });
        }
        app.useStaticAssets(uploadRoot, { prefix: '/uploads/' });
    }
    catch (err) {
        // In some deployment environments (read-only file systems) creating
        // the uploads folder will fail — log a warning and continue so the
        // server can still start without crashing.
        // eslint-disable-next-line no-console
        console.warn('Could not create or serve uploads directory:', err);
    }
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
