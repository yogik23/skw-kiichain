import { ethers } from "ethers";
import cron from "node-cron";
import { logger } from "./skw/logger.js";
import { cekbalance } from "./skw/helper.js";
import { ORO_address } from "./skw/contract.js";
import { swap } from "./src/swap.js";
import { addliquidity } from "./src/addliquidity.js";
import { deploy } from "./src/deploy.js";
import { stake } from "./src/stake.js";

import { 
  provider,
  privateKeys,
  delay,
  randomdelay,
  RandomAmount,
} from "./skw/config.js";

export const amountWarp = RandomAmount(3, 5, 0);
export const amountUnwarp = RandomAmount(1, 2, 1);
export const amountswapKIItoUSDT = RandomAmount(0.1, 1, 2);
export const amountswapKIItoUSDC = RandomAmount(0.1, 1, 2);
export const amountswapKIItoWBTC = RandomAmount(0.1, 1, 2);
export const amountaddLP = RandomAmount(10, 15, 0);
export const amountstake = RandomAmount(1, 2, 0);

async function startBot() {
  console.clear();
  try {
    for (const pk of privateKeys) {
      const wallet = new ethers.Wallet(pk, provider);
      logger.account(`Wallet: ${wallet.address}`);

      await swap(wallet);
      await delay(randomdelay());
      
      await addliquidity(wallet, amountaddLP);
      await delay(randomdelay());
      
      await deploy(wallet);
      await delay(randomdelay());

      await stake(wallet, amountstake);
      await delay(randomdelay());

      await cekbalance(wallet, ORO_address);
      await delay(randomdelay());

    }
  } catch (err) {
    logger.fail(`Function main Gagal ${err.message || err}\n`);
  }
}

async function main() {
  const date = new Date().toISOString().split('T')[0];
  cron.schedule('0 1 * * *', async () => { 
    await startBot();
    console.log();
    logger.info(`${date} Cron AKTIF`);
    logger.info('Besok Jam 08:00 WIB Autobot Akan Run');
  });

  await startBot();
  console.log();
  logger.info(`${date} Cron AKTIF`);
  logger.info('Besok Jam 08:00 WIB Autobot Akan Run');
}

main();
