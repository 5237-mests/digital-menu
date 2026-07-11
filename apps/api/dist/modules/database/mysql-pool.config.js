"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMysqlPoolConfig = buildMysqlPoolConfig;
function buildMysqlPoolConfig() {
    const config = {
        host: process.env.MYSQL_HOST ?? 'hypertechtechnology.com',
        port: Number(process.env.MYSQL_PORT ?? 3306),
        database: process.env.MYSQL_DATABASE ?? 'restaurant_system_saas',
        user: process.env.MYSQL_USER ?? 'restaurant_user',
        password: process.env.MYSQL_PASSWORD ?? 'restaurant_password',
        waitForConnections: true,
        connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10),
        maxIdle: Number(process.env.MYSQL_MAX_IDLE ?? 10),
        idleTimeout: Number(process.env.MYSQL_IDLE_TIMEOUT_MS ?? 60000),
        queueLimit: 0,
        namedPlaceholders: false
    };
    // console.log(`Database pool: ${formatMysqlConnectionString(config)}`);
    return config;
}
function formatMysqlConnectionString(config) {
    const user = encodeURIComponent(String(config.user ?? ''));
    const database = encodeURIComponent(String(config.database ?? ''));
    return `mysql://${user}:****@${config.host}:${config.port}/${database}`;
}
