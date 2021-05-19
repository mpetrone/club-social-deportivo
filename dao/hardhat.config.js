require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const { utils } = require("ethers");
const { parseUnits } = utils;

function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log("☢️ WARNING: No mnemonic file created for a deploy account. Try `npm run generate` and then `yarn run account`.")
    }
  }
  return "";
}

const defaultNetwork = "localhost";


module.exports = {

  networks: {
    hardhat: {
      mining: {
        //auto: false,
        //interval: 10000
      }
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/fe330bf9328c44ff95cedea956db7ff0", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    kovan: {
      url: "https://kovan.infura.io/v3/fe330bf9328c44ff95cedea956db7ff0", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/fe330bf9328c44ff95cedea956db7ff0", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/fe330bf9328c44ff95cedea956db7ff0", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    goerli: {
      url: "https://goerli.infura.io/v3/fe330bf9328c44ff95cedea956db7ff0", //<---- YOUR INFURA ID! (or it won't work)
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
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


task("generate", "Create a mnemonic for builder deploys", async (_, { ethers }) => {
  const bip39 = require("bip39")
  const mnemonic = bip39.generateMnemonic()
  const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)
  console.log("🔐 Account Generated as " + walletMnemonic.address + " and set as mnemonic in packages/hardhat")
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.")
  fs.writeFileSync("./" + walletMnemonic.address + ".txt", mnemonic.toString())
  fs.writeFileSync("./mnemonic.txt", mnemonic.toString())
});

task("account", "Get balance informations for the deployment account.", async (_, { ethers }) => {
  const bip39 = require("bip39")
  let mnemonic;
  try{
    mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    console.log("mnemonic does not exist. Please create a new one with yarn run generate")
    return;
  }
  const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)
  const address = walletMnemonic.address
  console.log("‍📬 Deployer Account is " + address)
  for (let n in config.networks) {
    try {
      let provider = new ethers.providers.JsonRpcProvider(config.networks[n].url)
      let balance = (await provider.getBalance(address))
      console.log(" -- " + n + " --  -- -- 📡 ")
      console.log("   balance: " + ethers.utils.formatEther(balance))
      console.log("   nonce: " + (await provider.getTransactionCount(address)))
    } catch (e) {
      if (DEBUG) {
        console.log(e)
      }
    }
  }
});