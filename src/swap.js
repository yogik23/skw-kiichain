import { ethers } from "ethers";
import { logger } from "../logger.js";
import { delay } from "../skw/config.js";
import { warpUnwarp_abi } from "../skw/abis.js";
import { 
  usdt_address,
  usdc_address,
  wbtc_address,
  wKII_address,
  swap_router,
  explorer,
} from "../skw/contract.js";

import { 
  provider,
  privateKeys,
  delay,
} from "../skw/config.js";

import { 
  cekbalance,
  providerbalance,
} from "../skw/helper.js";

async function Warp(wallet, amount) {
  try {
    const contract = new ethers.Contract(wKII_address, warpUnwarp_abi, wallet);
    await providerbalance(wallet);
    await cekbalance(wallet, wKII_address);

    logger.start(`Swap ${amount} KII ke ${amount} wKII`);

    const tx = await contract.deposit({
      value: ethers.parseEther(amount),
    });

    logger.send(`Tx dikirim ->> ${explorer}${tx.hash}`);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      logger.succes(`Swap success\n`);
    } else {
      logger.fail(`Swap failed\n`);
    }
  } catch (err) {
    logger.fail(`Transaksi Warp Gagal ${err.message || err}\n`);
  }
}

async function Unwarp(wallet, unwarpamount) {
  try {
    const amount = ethers.parseUnits(unwarpamount, 18); 
    const contract = new ethers.Contract(wKII_address, warpUnwarp_abi, wallet);

    await providerbalance(wallet);
    await cekbalance(wallet, wKII_address);

    logger.start(`Swap ${unwarpamount} wKII ke ${unwarpamount} KII`);

    const tx = await contract.withdraw(amount);

    logger.send(`Tx dikirim ->> ${explorer}${tx.hash}`);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      logger.succes(`Swap success\n`);
    } else {
      logger.fail(`Swap failed\n`);
    }
  } catch (err) {
    logger.fail(`Transaksi Unwarp Gagal ${err.message || err}\n`);
  }
}

async function swapKIItoUSDT(wallet, tokenIn, tokenOut, amount) {
  try {
    const iface = new ethers.Interface([
      "function execute(bytes commands, bytes[] inputs, uint256 deadline)"
    ]);
    
    const commands = "0x0b00";
    const fee = 100;
    const deadline = Math.floor(Date.now() / 1000) + 60;
    const amountIn = ethers.parseUnits(amount, 18);
    const amountOutMin = 0n;

    const input0 = ethers.concat([
      ethers.zeroPadValue("0x02", 32),
      ethers.zeroPadValue(ethers.toBeHex(amountIn), 32)
    ]);

    const tokenInBytes = ethers.getBytes(tokenIn);
    const tokenOutBytes = ethers.getBytes(tokenOut);
    const feeBytes = ethers.zeroPadValue(ethers.toBeHex(fee), 3);

    const path = ethers.concat([
      tokenInBytes,
      feeBytes,
      tokenOutBytes,
      ethers.zeroPadValue("0x00", 21)
    ]);

    const head = ethers.concat([
      ethers.zeroPadValue("0x01", 32),
      ethers.zeroPadValue(ethers.toBeHex(amountIn), 32),
      ethers.zeroPadValue(ethers.toBeHex(amountOutMin), 32),
      ethers.zeroPadValue(ethers.toBeHex(0xa0), 32),
      ethers.zeroPadValue(ethers.toBeHex(0x00), 32),
      ethers.zeroPadValue(ethers.toBeHex(0x2b), 32),
    ]);

    const input1 = ethers.concat([
      head,
      path
    ]);

    const calldata = iface.encodeFunctionData("execute", [
      commands,
      [input0, input1],
      deadline
    ]);

    const getBalance = await provider.getBalance(wallet.address);
    const Balance = ethers.formatUnits(getBalance,18);
    const formatbalance = parseFloat(Balance).toFixed(3);
    logger.balance(`Balance KII : ${formatbalance} `);
    const { symbol } = await cekbalance(wallet, tokenOut);
    logger.start(`Swap ${amount} KII ke ${symbol}..`);

    const tx = await wallet.sendTransaction({
      to: swap_router,
      data: calldata,
      value: amountIn,
    });

    logger.send(`Tx dikirim ->> ${explorer}${tx.hash}`);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      logger.succes(`Swap success\n`);
    } else {
      logger.fail(`Swap failed\n`);
    }

  } catch (err) {
    logger.fail(`Transaksi Swap Gagal ${err.message || err}\n`);
  }
}

export async function swap(wallet) {
  try {
    await Warp(wallet, "5");
    await delay(5000);

    await Unwarp(wallet, "2");
    await delay(5000);

    await swapKIItoUSDT(wallet, wKII_address, usdt_address, "0.1");
    await delay(5000);

    await swapKIItoUSDT(wallet, wKII_address, usdc_address, "0.1");
    await delay(5000);

    await swapKIItoUSDT(wallet, wKII_address, wbtc_address, "0.1");
    await delay(5000);
  } catch (err) {
    logger.fail(`Function Swap Gagal ${err.message || err}\n`);
  }
}
