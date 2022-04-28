import "reflect-metadata";
import mongoose from "mongoose";
export default {} = async function globalSetup() {
  afterAll(async () => {
    await mongoose.disconnect();
  });
};
