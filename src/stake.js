import { ethers } from "ethers";
import { logger } from "../skw/logger.js";
import { stake_address } from "../skw/contract.js";
import { stake_abi } from "../skw/abis.js";
import { getRandomValidator } from "../skw/config.js";

export async function stake(wallet, amountstake) {
  const contract = new ethers.Contract(stake_address, stake_abi, wallet);
  const validator = getRandomValidator();
  const amount = ethers.parseUnits(amountstake, 18);

  logger.start(`Staking ${amountstake} KII ke ${validator.moniker}`);

  try {
    const tx = await contract.delegate(
      wallet.address,
      validator.address,
      amount,
      {
        gasLimit: 210000n,
        maxFeePerGas: BigInt("0x22ecb25c00"),
        maxPriorityFeePerGas: BigInt("0x8bb2c9700")
      }
    );

    logger.send(`Tx dikirim ->> ${explorer}${tx.hash}`);
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      logger.succes(`Stake success\n`);
    } else {
      logger.fail(`Stake failed\n`);
    }
  } catch (err) {
    logger.fail(`Transaksi Stake Gagal ${err.message || err}\n`);
  }
}
