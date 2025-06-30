import { ethers } from "ethers";
import solc from "solc";
import { logger } from "../skw/logger.js";
import { explorer } from "../skw/contract.js";
import { 
  randomTokenName,
  randomSymbol,
  randomSupply,
} from "../skw/config.js";

const sourceCode = `
pragma solidity ^0.8.17;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    constructor(string memory _name, string memory _symbol, uint _initialSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }
}
`;

function compileContract(source) {
  const input = {
    language: "Solidity",
    sources: {
      "MyToken.sol": { content: source }
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "london",
      outputSelection: {
        "*": { "*": ["abi", "evm.bytecode"] }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts["MyToken.sol"]["MyToken"];
  if (!contract) throw new Error("❌ Gagal menemukan MyToken.sol dalam hasil kompilasi.");
  return { abi: contract.abi, bytecode: contract.evm.bytecode.object };
}

export async function deploy(wallet) {
  try {
    const tokenName = randomTokenName();
    const symbol = randomSymbol(tokenName);
    const supply = randomSupply();

    logger.start(`Deploying token: ${tokenName} (${symbol}) with supply ${supply}`);

    const { abi, bytecode } = compileContract(sourceCode);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const initialSupply = ethers.parseUnits(supply, 18);

    const contract = await factory.deploy(tokenName, symbol, initialSupply);
    const deploymentTx = contract.deploymentTransaction();

    if (!deploymentTx.hash) {
      logger.fail(`Gagal mendapatkan tx hash dari deployment`);
      return;
    }

    logger.send(`Tx dikirim ->> ${explorer}${deploymentTx.hash}`);

    const receipt = await wallet.provider.waitForTransaction(deploymentTx.hash);
    
    if (receipt.status === 1) {
      logger.succes(`Deploy success`);
      logger.info(`Contract yg dideploy ->> ${contract.target}\n`);
    } else {
      logger.fail(`Deploy failed: Status ${receipt.status}\n`);
    }

  } catch (err) {
    logger.fail(`Transaksi Deploy Gagal: ${err.message || err}\n`);
  }
}
