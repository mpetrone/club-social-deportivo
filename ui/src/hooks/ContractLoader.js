/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { ethers } from "ethers";
import { useState, useEffect } from "react";

let DEBUG = true

const loadContract = (networkName, contractName, signer) => {
  const newContract = new ethers.Contract(
    require(`../contracts/${networkName}/${contractName}.address.js`),
    require(`../contracts/${networkName}/${contractName}.abi.js`),
    signer,
  );
  try {
    newContract.bytecode = require(`../contracts/${networkName}/${contractName}.bytecode.js`);
  } catch (e) {
    console.log(e);
  }
  if (DEBUG) console.log("New contract " + contractName + " was created with address: " + newContract.address)
  return newContract;
};

export function useContractLoader(network, providerOrSigner) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    async function loadContracts() {
      if (typeof providerOrSigner !== "undefined") {
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          let signer;
          let accounts;
          if (providerOrSigner && typeof providerOrSigner.listAccounts === "function") {
            accounts = await providerOrSigner.listAccounts();
          }

          if (accounts && accounts.length > 0) {
            signer = providerOrSigner.getSigner();
          } else {
            signer = providerOrSigner;
          }

          const contractList = require(`../contracts/${network.name}/contracts.js`);

          const newContracts = contractList.reduce((accumulator, contractName) => {
            accumulator[contractName] = loadContract(network.name, contractName, signer);
            return accumulator;
          }, {});
          setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContracts();
  }, [providerOrSigner]);
  return contracts;
}
