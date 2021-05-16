require("@nomiclabs/hardhat-waffle");
const { utils } = require("ethers");
const { parseUnits } = utils;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/", //<---- YOUR INFURA ID! (or it won't work)
    },
    kovan: {
      url: "https://kovan.infura.io/v3/", //<---- YOUR INFURA ID! (or it won't work)
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/", //<---- YOUR INFURA ID! (or it won't work)
    }
  },
  solidity: {
    version: '0.8.4'
  }
}

function send(signer, txparams) {
  return signer.sendTransaction(txparams, (error, transactionHash) => {
    if (error) {
      debug(`Error: ${error}`);
    }
    debug(`transactionHash: ${transactionHash}`);
    // checkForReceipt(2, params, transactionHash, resolve)
  });
}

task("fundedwallet", "Fund wallet with amout")
  .addOptionalParam("address", "Where to send the eth")
  .addOptionalParam("amount", "Amount of ETH to send to wallet after generating")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")
  .setAction(async (taskArgs, { network, ethers }) => {
    const accounts = await ethers.getSigners();
    const from = accounts[0]
    const to = taskArgs.address;

    const txRequest = {
      from: await from.getAddress(),
      to,
      value: parseUnits(
          taskArgs.amount ? taskArgs.amount : "0",
          "ether"
      ).toHexString(),
      nonce: await from.getTransactionCount(),
      gasPrice: parseUnits(
          taskArgs.gasPrice ? taskArgs.gasPrice : "1.001",
          "gwei"
      ).toHexString(),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
    };

    console.log(txRequest.gasPrice / 1000000000 + " gwei");
    console.log(JSON.stringify(txRequest, null, 2));

    return send(from, txRequest);
  });


