import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { mikroOrmOptions } from "./mikroOrmOptions";

const config: Options<PostgreSqlDriver> = {
  ...mikroOrmOptions,
};
export default config;
