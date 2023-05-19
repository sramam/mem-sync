import fs from "fs";
import dotenv from "dotenv";
// Load initial .env variables
dotenv.config();

/**
 * https://github.com/motdotla/dotenv/issues/122#issuecomment-1538206340
 * @author Mohamed Riyad <m@ryad.me>
 * This function will reload the .env variables.
 */
export const reloadEnv = () => {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));

  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
};
