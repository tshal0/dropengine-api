import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { mikroOrmOptions } from "./mikroOrmOptions";

const config: Options<PostgreSqlDriver> = {
  ...mikroOrmOptions,
  migrations: {
    ...mikroOrmOptions.migrations,
  },
  // schemaGenerator: {
  //   disableForeignKeys: false, // try to disable foreign_key_checks (or equivalent)
  //   createForeignKeyConstraints: true, // do not generate FK constraints
  // },
};
export default config;
