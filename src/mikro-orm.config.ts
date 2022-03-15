import { DbProduct } from "@catalog/domain/entities/Product.entity";
import { DbProductType } from "@catalog/domain/entities/ProductType.entity";
import { DbProductVariant } from "@catalog/domain/entities/ProductVariant.entity";
import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { DbUser } from "@users/domain/entities/User.entity";

const config: Options<PostgreSqlDriver> = {
  entities: [DbProduct, DbProductType, DbProductVariant, DbUser],
  clientUrl: process.env.DATABASE_URL || undefined,
  driverOptions: {
    connection: { ssl: process.env.POSTGRES_SSL || false },
  },
  migrations: { disableForeignKeys: false },
  // dbName: process.env.POSTGRES_DB || "dropengine",
  // host: process.env.POSTGRES_HOST || "localhost",
  // port: parseInt(process.env.POSTGRES_PORT) || 5432,
  // user: process.env.POSTGRES_USER || "postgres",
  // password: process.env.POSTGRES_PASSWORD || "password",
  // schema: process.env.POSTGRES_SCHEMA || "public",
  type: "postgresql",
  debug: true,
};
export default config;
