import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { config } from "./config";

export default {} = async function globalSetup() {
  if (process.env.DEBUG == "1") {
    process.env.MONGOMS_DEBUG = "1";
  } else {
    process.env.MONGOMS_DEBUG = null;
  }
  console.log("🚀 ~ file: globalSetup.ts ~ line 7 ~ globalSetup BEGIN");
  if (config.memory) {
    // Config to decided if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance =
      (global as any).__MONGOINSTANCE ||
      (await MongoMemoryServer.create({
        instance: { ip: config.ip, dbName: config.db, port: config.port },
      }));
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
    process.env.MONGO_CONNECTION_STRING = uri.slice(0, uri.lastIndexOf("/"));
  } else {
    process.env.MONGO_CONNECTION_STRING = `mongodb://${config.ip}:${config.port}`;
  }

  // The following is to make sure the database is clean before an test starts
  await mongoose.connect(
    `${process.env.MONGO_CONNECTION_STRING}/${config.db}`,
    {}
  );
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  console.log("🚀 ~ file: globalSetup.ts ~ line 7 ~ globalSetup END");
};
