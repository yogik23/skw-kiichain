import { ethers } from "ethers";
import axios from "axios";
import { logger } from "../skw/logger.js";
import { delay, randomdelay } from "../skw/config.js";
import { ORO_address } from "../skw/contract.js";
import { cekbalance } from "../skw/helper.js";

const alltask = [
  "hasSwaps",
  "hasStaking",
  "hasContracts",
  "kiidex-pool",
];

async function login(wallet) {
  try {
    const url = `https://backend.testnet.kiivalidator.com/users/${wallet.address}`;
    const res = await axios.get(url, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    });

    const username = res.data?.user?.userName;
    if (res.data?.success === true) {
      logger.succes(`Berhasil Login Akun ${username}\n`);
    } else {
      logger.fail(`Gagal Login\n`);
    }
    return username;
  } catch (err) {
    logger.fail(`Login Error ${err.message || err}\n`);
  }
}

async function cekreward(username, tugas) {
  try {
    const url = `https://backend.testnet.kiivalidator.com/task/${tugas}/${username}`;
    const res = await axios.get(url, {
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    });

    const hasReward = res.data?.hasReward;
    logger.info(`Task ${tugas} → ${hasReward}`);
    return hasReward;
  } catch (err) {
    logger.fail(`Cek Reward Error ${err.message || err}\n`);
    return false;
  }
}

async function claimreward(username, tugas) {
  try {
    logger.start(`Mengecek Task ${tugas}`);
    const hasReward = await cekreward(username, tugas);
    if (!hasReward) {
      logger.warn(`Skip Claim ${tugas} → Tidak ada reward yg bisa diclaim\n`);
      return;
    }

    logger.send(`Memproses Claim Task ${tugas}`);

    const claimUrl = `https://backend.testnet.kiivalidator.com/task/${tugas}`;
    const payload = { userName: username };

    const claimRes = await axios.post(claimUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
    });

    if (claimRes.data?.success) {
      logger.succes(`Claim ${tugas} Berhasil`);
      logger.send(`TX Hash: ${claimRes.data.txHash}\n`);
    } else {
      logger.fail(`Claim ${tugas} Gagal: ${claimRes.data?.errorMessage || 'Unknown error'}\n`);
    }

  } catch (err) {
    logger.fail(`Claim Error ${err.message || err}\n`);
  }
}

export async function cekpoint(wallet) {
  try {
    logger.account(`Wallet: ${wallet.address}`);
    const username = await login(wallet);
    if (!username) {
      logger.fail('Username tidak ditemukan, skip...\n');
      return;
    }

    for (const tugas of alltask) {
      await claimreward(username, tugas);
      await delay(5000);
    }

    await cekbalance(wallet, ORO_address);

  } catch (err) {
    logger.fail(`cekpoint Error ${err.message || err}\n`);
  }
}
