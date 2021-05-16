import { useState } from 'react'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '196440d5d02d41dfa2a8ee5bfd2e96bd',
    }
  }
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});


export function useWeb3Modal(provider, setProvider, userAddress, setUserAddress) {
  // Automatically connect if the provider is cashed but has not yet
  // been set (e.g. page refresh)
  if (web3Modal.cachedProvider && !provider) {
    connectWallet();
  }

  async function connectWallet() {
    try {
      const provider = await web3Modal.connect();
      const ethersProvider = new ethers.providers.Web3Provider(provider, "any");

      ethersProvider.on("network", (newNetwork, oldNetwork) => {
        console.log("Network changed, newNetwork: " + newNetwork + " oldNetwork: " + oldNetwork)
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
            window.location.reload();
        }
      });

      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        console.log("accountsChanged: ", userAddress);
        if(accounts && accounts.lenght != 0 && accounts[0] !== userAddress){
          setUserAddress(accounts[0])
        }
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code, reason) => {
        console.log("disconnect: ", code, reason);
      });      

      setProvider(ethersProvider);
    } catch(e) {
      console.log('NO_WALLET_CONNECTED', e);
    }
  }

  function disconnectWallet() {
    web3Modal.clearCachedProvider();
    setProvider(undefined);
  }

  return { connectWallet, disconnectWallet, web3Modal }
}
