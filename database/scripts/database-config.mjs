export function getDatabaseConfig() {
  return {
    host: process.env.MYSQL_HOST ?? 'hypertechtechnology.com',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE ?? 'restaurant_system',
    user: process.env.MYSQL_USER ?? 'restaurant_user',
    password: process.env.MYSQL_PASSWORD ?? 'restaurant_password',
    multipleStatements: true
  };
}

export function formatDatabaseConnectionString(config) {
  const user = encodeURIComponent(config.user);
  const database = encodeURIComponent(config.database);

  return `mysql://${user}:****@${config.host}:${config.port}/${database}`;
}
