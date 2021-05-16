/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { ethers, config } = require("hardhat");
const { utils } = require("ethers");

const publishDir = "../ui/src/contracts";

const main = async () => {

  console.log("\n\n 📡 Deploying...\n");

  const PohMock = await deploy("ProofOfHumanityMock") 
  const Memberships = await deploy("Memberships", [PohMock.address])
  const Proposals = await deploy("Proposals", [Memberships.address])
  const Votes = await deploy("Votes", [Memberships.address, Proposals.address])
  publishContract("ProofOfHumanityMock")
  publishContract("Memberships")
  publishContract("Proposals")
  publishContract("Votes")

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName,{libraries: libraries});
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  let extraGasInfo = ""
  if(deployed&&deployed.deployTransaction){
    const gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
    extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
  }

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address)
  );
  console.log(
    " ⛽",
    chalk.grey(extraGasInfo)
  );

  return deployed;
};


function publishContract(contractName) {
  console.log(
    " 💽 Publishing",
    chalk.cyan(contractName),
    "to",
    chalk.gray(publishDir)
  );
  try {
    let contract = fs
      .readFileSync(`${config.paths.artifacts}/contracts/${contractName}.sol/${contractName}.json`)
      .toString();
    const address = fs
      .readFileSync(`${config.paths.artifacts}/${contractName}.address`)
      .toString();
    contract = JSON.parse(contract);

    fs.writeFileSync(
      `${publishDir}/${contractName}.address.js`,
      `module.exports = "${address}";`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.abi.js`,
      `module.exports = ${JSON.stringify(contract.abi, null, 2)};`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.bytecode.js`,
      `module.exports = "${contract.bytecode}";`
    );

    console.log(" 📠 Published "+chalk.green(contractName)+" to the frontend.")

    return true;
  } catch (e) {
    if(e.toString().indexOf("no such file or directory")>=0){
      console.log(chalk.yellow(" ⚠️  Can't publish "+contractName+" yet (make sure it getting deployed)."))
    }else{
      console.log(e);
      return false;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
