module.exports = {
  "name": "default",
    "type": "mysql",
    "host": process.env.DATABASE_HOST || 'localhost',
    "port": parseInt(process.env.DATABASE_PORT, 10) || 3306,
    "username": process.env.DATABASE_USERNAME || 'root',
    "password": process.env.DATABASE_PASSWORD || '',
    "database": process.env.DATABASE_DB || 'app',
    "entities": ["dist/**/*.entity{ .ts,.js}"],
    "synchronize": false,
    "migrations": ["dist/**/*/migrations/*{.ts,.js}"],
    "migrationsTableName": "migrations",
    "migrationsRun": true
}