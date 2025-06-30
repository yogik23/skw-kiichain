import { ethers } from "ethers";
import { logger } from "./logger.js";
import { erc20Abi } from "./abis.js";
import { provider } from "./config.js";
import { explorer } from "./contract.js";

export async function cekbalance(wallet, tokenIn) {
  try {
    const contract = new ethers.Contract(tokenIn, erc20Abi, wallet);
    const decimal = await contract.decimals();
    const name = await contract.name();
    const symbol = await contract.symbol();

    const balancewei = await contract.balanceOf(wallet.address);
    const formatbalance = ethers.formatUnits(balancewei, decimal);
    const fixbalance = parseFloat(formatbalance).toFixed(3);
    logger.balance(`Balance ${symbol} : ${fixbalance} `)
    return { balancewei, decimal, symbol } ;
  } catch (err) {
    logger.fail(`Error Cek Balance : ${err.message || err}\n`);
  }
}

export async function providerbalance(wallet) {
  try {
    const balance = await provider.getBalance(wallet.address);
    const ethBalance = ethers.formatEther(balance);
    const fixedAmount = parseFloat(ethBalance).toFixed(4);
    logger.balance(`Balance KII : ${fixedAmount}`);

  } catch (err) {
    logger.fail(`Provider get balance Gagal ${err.message || err}\n`);
  }
}

export async function approve(wallet, tokenAddress, spenderAddress, amount) {
  const token = new ethers.Contract(tokenAddress, erc20Abi, wallet);
  const decimals = await token.decimals();
  const symbol = await token.symbol();

  const allowance = await token.allowance(wallet.address, spenderAddress);
  if (allowance >= amount) {
    return;
  }

  logger.start(`Approve ${symbol} Dahulu...`);

  try {
    const tx = await token.approve(spenderAddress, amount);
    logger.send(`Tx dikirim ->> ${explorer}${tx.hash}`);
    await tx.wait();
    logger.succes(`Approve berhasil`);
  } catch (err) {
    logger.fail(`Gagal approve: ${err.message || err}`);
  }
}
