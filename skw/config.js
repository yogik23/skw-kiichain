import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC = "https://json-rpc.uno.sentry.testnet.v3.kiivalidator.com/";
export const provider = new ethers.JsonRpcProvider(RPC);

export const privateKeys = fs.readFileSync(path.join(__dirname, "../privatekey.txt"), "utf-8")
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

export function getRandomValidator() {
  const validators = [
    { address: "kiivaloper1zumlpw2c86ycg36a2zjtxdrj936vmjx3h5sjdd", moniker: "KiiMidas" },
    { address: "kiivaloper1am7xh6qwxr8vt6ztz2gm6vxnu8w4psmcdg45yd", moniker: "KiiPaladin" },
    { address: "kiivaloper1at98tkmqr2gmq80g38rrtdc8wh8cj0qggevzqa", moniker: "ValKiirie" },
    { address: "kiivaloper1zsnvhm8jn2qngmk2cuegjq6a66r8mn8uurhtcc", moniker: "Crosnest" },
    { address: "kiivaloper1s9uuamt582pn38ptq2chduawd2fzgzewtycasr", moniker: "Vinjan" },
    { address: "kiivaloper1z0fyvylcz3x8yqanu2th2f9s8vljf83p2ygjqc", moniker: "NodeStake" },
    { address: "kiivaloper1ge2g93pwgk260pgwctnsz2n5jjt37l0ezrpsk6", moniker: "gombezz_oro" },
    { address: "kiivaloper1ynwlg7d8q49fm0n49pnnkwu4kme3y6w5rh68pc", moniker: "maouam" },
    { address: "kiivaloper1fefmaqrd3f9vczv8q5hw8e6enqvmq4q4x72llr", moniker: "BoyGau" },
    { address: "kiivaloper1r844rpksx4vjglulgwfdmtlecr8k0985x9ph4c", moniker: "MIPEnode" }
  ];

  const randomValidator = validators[Math.floor(Math.random() * validators.length)];
  return randomValidator;
}
