import { ethers } from "ethers";
import { logger } from "../skw/logger.js";
import { delay, provider } from "../skw/config.js";
import { lp_abi, POOL_ABI } from "../skw/abis.js";
import { cekbalance, approve } from "../skw/helper.js";
import { amountaddLP } from "../skw/amount.js";

import { 
  usdt_address,
  wKII_address,
  lp_router,
  poolAddress,
  explorer,
} from "../skw/contract.js";

async function getPoolInfo(poolAddress, tokenA, tokenB) {
  const pool = new ethers.Contract(poolAddress, POOL_ABI, provider);
  const [token0, token1, fee, liquidity, slot0] = await Promise.all([
    pool.token0(),
    pool.token1(),
    pool.fee(),
    pool.liquidity(),
    pool.slot0(),
  ]);

  const tokensInPool = [token0.toLowerCase(), token1.toLowerCase()];
  if (!tokensInPool.includes(tokenA.toLowerCase()) || !tokensInPool.includes(tokenB.toLowerCase())) {
    throw new Error("Pool tidak mengandung tokenA dan tokenB yang diminta");
  }

  const sqrtPriceX96 = slot0.sqrtPriceX96;
  const tickCurrent = slot0.tick;

  return {
    token0,
    token1,
    fee,
    liquidity,
    sqrtPriceX96,
    tickCurrent,
  };
}

export async function addliquidity(wallet, amountaddLP) {
  const tokenA = usdt_address;
  const tokenB = wKII_address;
  const fee = 3000;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  const positionManager = new ethers.Contract(lp_router, lp_abi, wallet);
  const poolInfo = await getPoolInfo(poolAddress, tokenA, tokenB);

  let token0 = poolInfo.token0.toLowerCase();
  let token1 = poolInfo.token1.toLowerCase();
  const isToken0A = tokenA.toLowerCase() === token0;

  const tokenIn = isToken0A ? tokenA : tokenB;
  const tokenOut = isToken0A ? tokenB : tokenA;

  const { balancewei: balance0, symbol: symbol0, decimal: decimal0 } = await cekbalance(wallet, token0);
  const { balancewei: balance1, symbol: symbol1, decimal: decimal1 } = await cekbalance(wallet, token1);

  const parsedAmount0 = ethers.parseUnits(amountaddLP, decimal0);

  const sqrtX96 = BigInt(poolInfo.sqrtPriceX96);
  const Q96 = BigInt(2) ** BigInt(96);
  const price = (sqrtX96 * sqrtX96) / (Q96 * Q96);
  const amount1 = parsedAmount0 * price;
  const parsedAmount1 = amount1;
  const amount1Str = ethers.formatUnits(parsedAmount1, decimal1);
  const amount1DesiredStr = parseFloat(amount1Str).toFixed(5);

  logger.start(`Add Liquidity ${amountaddLP} ${symbol0} >> ${amount1DesiredStr} ${symbol1}`);
  await approve(wallet, token0, lp_router, parsedAmount0);
  await approve(wallet, token1, lp_router, parsedAmount1);

  const tickSpacing = 60n;
  const tickCurrent = BigInt(poolInfo.tickCurrent);
  const nearestTick = (tickCurrent / tickSpacing) * tickSpacing;
  const tickLower = nearestTick - tickSpacing * 10n;
  const tickUpper = nearestTick + tickSpacing * 10n;

  if (tickLower >= tickUpper) throw new Error('tickLower >= tickUpper');
  if (tickLower < -8388608 || tickUpper > 8388607) throw new Error('tick out of range');

  const params = {
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    amount0Desired: parsedAmount0,
    amount1Desired: parsedAmount1,
    amount0Min: 0,
    amount1Min: 0,
    recipient: wallet.address,
    deadline,
  };

  try {
    const tx = await positionManager.mint(params);
    logger.send(`Tx dikirim ->> ${explorer}${tx.hash}`);
    const receipt = await tx.wait();

    const iface = new ethers.Interface(["event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"]);
    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed.name === "Transfer" && parsed.args.from === ethers.ZeroAddress) {
          tokenId = parsed.args.tokenId;
          break;
        }
      } catch {}
    }

    if (tokenId) {
      logger.succes(`Add LP berhasil ->> TokenId = ${tokenId}\n`);
    } else {
      logger.warn(`LP berhasil, tapi tokenId tidak ditemukan`);
    }

  } catch (err) {
    logger.fail(`Gagal add LP: ${err.reason || err.message}`);
  }
}

