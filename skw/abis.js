export const erc20Abi = [
  "function approve(address guy, uint256 wad) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() public view returns (uint8)",
  "function name() public view returns (string)",
  "function symbol() public view returns (string)"
];

export const warpUnwarp_abi = [
  "function deposit() external payable",
  "function withdraw(uint256) external",
];

export const lp_abi = [
  "function mint(tuple(address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)",
  "function multicall(bytes[] calldata data) payable returns (bytes[] memory results)",
  "function refundETH() payable"
];

export const POOL_ABI = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function fee() view returns (uint24)",
  "function liquidity() view returns (uint128)",
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
];
