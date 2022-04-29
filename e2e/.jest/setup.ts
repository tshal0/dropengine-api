import dotenv from "dotenv";

// Assuming root is root of repo
dotenv.config({ path: "./e2e/e2e.env" });
console.log({ env: process.env });
