import { MongoMemoryServer } from "mongodb-memory-server";
import { config } from "./config";

export default {} = async function globalTeardown() {
  console.log("🚀 ~ file: globalTeardown.ts ~ line 6 ~ globalTeardown ~ BEGIN");
  // if (config.memory) {
  //   // Config to decided if an mongodb-memory-server instance should be used
  //   const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
  //   await instance.stop();
  // }
  console.log("🚀 ~ file: globalTeardown.ts ~ line 6 ~ globalTeardown ~ END");
};
