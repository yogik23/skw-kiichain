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

export function randomdelay(min = 5000, max = 10000) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function RandomAmount(min, max, decimalPlaces) {
  return (Math.random() * (max - min) + min).toFixed(decimalPlaces);
}

const prefixes = [ 'Neo', 'Meta', 'Alpha', 'Turbo', 'Proto', 'Quantum', 'Mega', 'Hyper', 'Ultra', 'Cryo', 'Astro', 'Cyber', 'Nano', 'Zen', 'Giga', 'Omni', 'Vortex', 'Luna', 'Volt', 'Solar', 'Pixel', 'Dark', 'Light', 'Myst', 'Pluto', 'Nova', 'Zero', 'Echo', 'Core', 'Flux', 'Iron', 'Steel', 'Ghost', 'Sky', 'Storm', 'Chrono', 'Blade', 'Shadow', 'Crystal', 'Aero', 'Pyro', 'Glitch', 'Frost', 'Byte', 'Fire', 'Spark', 'Wisp', 'Draco', 'Dust' ];
const suffixes = [ 'Core', 'X', 'Net', 'Byte', 'Chain', 'Verse', 'Token', 'Fi', 'Labs', 'Edge', 'Storm', 'Link', 'Hub', 'Flow', 'OS', 'Pulse', 'Sync', 'Block', 'Dex', 'Vault', 'Swap', 'SwapX', 'Boost', 'Launch', 'Beam', 'Pad', 'Dash', 'Rise', 'Spark', 'Jet', 'Fuel', 'Stack', 'Craft', 'Zone', 'Forge', 'Mode', 'ByteX', 'Syncer', 'Engine', 'Connect' ];

export function randomTokenName() {
  const pre = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
  return pre + suf;
}

export function randomSymbol(name) {
  const upper = name.toUpperCase().replace(/[^A-Z]/g, '');
  let symbol = upper[0];
  if (upper.length > 2) symbol += upper[Math.floor(upper.length / 2)];
  if (upper.length > 3) symbol += upper.slice(-1);
  return symbol.slice(0, 4);
}

export const randomSupply = () => {
  const supplyOptions = ['10000000', '100000000', '1000000000', '2000000000', '4000000000', '10000000000'];
  return supplyOptions[Math.floor(Math.random() * supplyOptions.length)];
};
