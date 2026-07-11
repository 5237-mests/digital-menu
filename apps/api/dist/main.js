"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const app_module_1 = require("./modules/app.module");
const tenant_context_service_1 = require("./modules/tenants/tenant-context.service");
const tenants_service_1 = require("./modules/tenants/tenants.service");
const API_ROUTE_PATTERN = /^\/(auth|users|categories|menu-items|tables|orders|dashboard|settings|public|health|platform|setup|billing)(\/|$)/;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const tenantContext = app.get(tenant_context_service_1.TenantContextService);
    const tenantsService = app.get(tenants_service_1.TenantsService);
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
    app.use(async (req, _res, next) => {
        const host = ((req.headers.host ?? '').split(':')[0] ?? '').toLowerCase();
        const baseDomain = (process.env.BASE_DOMAIN ?? '').toLowerCase();
        const slug = baseDomain && host.endsWith(`.${baseDomain}`)
            ? host.slice(0, -(baseDomain.length + 1)).split('.')[0]
            : (process.env.DEFAULT_TENANT_SLUG ?? 'default');
        const tenant = await tenantsService.findBySlug(slug ?? 'default');
        if (tenant)
            tenantContext.run({ id: tenant.id, slug: tenant.slug, status: tenant.status }, next);
        else
            next();
    });
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
