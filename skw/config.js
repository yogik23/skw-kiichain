import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC = "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/";
export const provider = new ethers.JsonRpcProvider(RPC);

export const privateKeys = fs.readFileSync(path.join(__dirname, "privatekey.txt"), "utf-8")
  .split("\n")
  .map(k => k.trim())
  .filter(k => k.length > 0);

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
