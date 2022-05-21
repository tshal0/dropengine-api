export const mikroOrmOptions = {
  entities: ["./dist/**/entities/*.entity.js"],
  entitiesTs: ["./src/**/entities/*.entity.ts"],
  clientUrl: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  driverOptions: {
    connection: { ssl: process.env.POSTGRES_SSL || false },
  },
  // Stupid hack to make TS stop complaining about env.DB_TYPE
  type: (process.env.DB_TYPE as "postgresql") || "postgresql",
  debug: process.env.ENVIRONMENT != "production",
  migrations: {
    tableName: "mikro_orm_migrations",
    disableForeignKeys: false,
  },
};
