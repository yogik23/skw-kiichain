import { ethers } from "ethers";
import solc from "solc";
import { logger } from "../skw/logger.js";
import { explorer } from "../skw/contract.js";
import { 
  randomTokenName,
  randomSymbol,
  randomSupply,
} from "../skw/config.js";


function generateContract(name, symbol, supply) {
  const source = `// SPDX-License-Identifier: UNLICENSED
  pragma solidity ^0.8.17;
  
  contract ERC20 {
      mapping(address => uint) public balanceOf;
      mapping(address => mapping(address => uint)) public allowance;
      string public name;
      string public symbol;
      uint8 public decimals = 18;
      uint public totalSupply;

      event Transfer(address indexed from, address indexed to, uint value);
      event Approval(address indexed owner, address indexed spender, uint value);

      constructor(string memory _name, string memory _symbol, uint _supply) {
          name = _name;
          symbol = _symbol;
          totalSupply = _supply;
          balanceOf[msg.sender] = _supply;
          emit Transfer(address(0), msg.sender, _supply);
      }

      function transfer(address to, uint value) public returns (bool) {
          require(balanceOf[msg.sender] >= value);
          balanceOf[msg.sender] -= value;
          balanceOf[to] += value;
          emit Transfer(msg.sender, to, value);
          return true;
      }
  }

  contract ${name} is ERC20 {
      constructor() ERC20("${name}", "${symbol}", ${supply}) {}
  }`;

  const input = {
    language: "Solidity",
    sources: {
      "Contract.sol": { content: source },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const compiled = output.contracts["Contract.sol"][name];
  return {
    abi: compiled.abi,
    bytecode: compiled.evm.bytecode.object,
  };
}

export async function deploy(wallet) {
  try {
    const name = randomTokenName();
    const symbol = randomSymbol(name);
    const supply = randomSupply();
    const totalSupply = ethers.parseUnits(supply, 18);

    logger.start(`Deploying token: ${name} (${symbol}) with supply ${supply}`);
    const { abi, bytecode } = generateContract(name, symbol, totalSupply);

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const txHash = contract.deploymentTransaction().hash;
    const contractAddr = await contract.getAddress();

    logger.send(`Tx dikirim ->> ${explorer}${txHash}`);
    logger.succes(`Contract Deploy Token ${contractAddr}\n\n`);

    const token = new ethers.Contract(contractAddr, abi, wallet);
    const balance = await token.balanceOf(wallet.address);

    return { token, symbol };
  } catch (err) {
    logger.fail(`Deploy error: ${err.message}`);
    return null;
  }
}
