import { ethers } from "ethers";
import { logger } from "./skw/logger.js";
import { swap } from "./src/swap.js";
import { addliquidity } from "./src/addliquidity.js";
import { deploy } from "./src/deploy.js";

import { 
  provider,
  privateKeys,
  delay,
  randomdelay,
} from "./skw/config.js";

async function main() {
  console.clear();
  try {
    for (const pk of privateKeys) {
      const wallet = new ethers.Wallet(pk, provider);
      logger.account(`Wallet: ${wallet.address}`);

      await swap(wallet);
      await addliquidity(wallet);
      await delay(randomdelay());

    }
  } catch (err) {
    logger.fail(`Function main Gagal ${err.message || err}\n`);
  }
}

main();
