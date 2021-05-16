import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";

import { makeStyles } from '@material-ui/core/styles';

import { useWeb3Modal } from "../hooks/web3";

const truncateAddress = (address) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

const ConnectWallet = ({darkMode, provider, setProvider, userAddress, setUserAddress}) => {
  const classes = useStyles();

  const { connectWallet, disconnectWallet, web3Modal } = useWeb3Modal(provider, setProvider, userAddress, setUserAddress);

  useEffect(() => {    
    const getAddress = async () => { 
      const signer = provider.getSigner(); 
      const address = await signer.getAddress(); 
      setUserAddress(address); 
    } 
    if (provider) getAddress(); 
    else setUserAddress("");
  }, [provider]);

  useEffect(() => {
    web3Modal.updateTheme(darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleClickConnect = async () => {
    await connectWallet();
  };

  const handleClickAddress = () => {
    disconnectWallet();
  };

  return (
    <button
      className={classes.btn}
      onClick={userAddress ? handleClickAddress : handleClickConnect}>
      <Blockies
        className={classes.img}
        seed={userAddress.toLowerCase()}
        size={8}
        scale={3}
      />
      <div>
        {userAddress ? truncateAddress(userAddress) : "Connect Wallet"}
      </div>
    </button>
  );
}

const useStyles = makeStyles((theme) => ({
  btn: {
    background: 'rgb(183,192,238)',
    cursor: 'pointer',
    border: 0,
    outline: 'none',
    borderRadius: 9999,
    height: 35,
    display: 'flex',
    alignItems: 'center'
  },
  img: {
    borderRadius: 999,
    marginRight: 5
  }
}));

export default ConnectWallet;