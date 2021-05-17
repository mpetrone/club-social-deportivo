import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {
  Brightness4Outlined as ToggleDarkModeIcon,
  Brightness5Outlined as ToggleLightModeIcon,
} from "@material-ui/icons/";
import { makeStyles, useTheme } from '@material-ui/core/styles';

import dynamic from "next/dynamic";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});

const Navbar = ({ toggleMode, darkMode, provider, setProvider, userAddress, setUserAddress}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <img src="/logo.svg" alt="logo" className={classes.img} />

        <Typography variant="h6" className={classes.title}>
          Social Club Deportivo
        </Typography>

        <IconButton
          edge="start"
          color="inherit"
          aria-label="mode"
          onClick={toggleMode}
          className={classes.toggleBtn}
        >
          {darkMode ? <ToggleLightModeIcon htmlColor={theme.custom.palette.iconColor} /> : <ToggleDarkModeIcon htmlColor={theme.custom.palette.iconColor} />}
        </IconButton>

        <ConnectWallet
          darkMode={darkMode}
          provider={provider}
          setProvider={setProvider}
          userAddress={userAddress}
          setUserAddress={setUserAddress}
        />
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 'auto',
    maxWidth: 1100,
    boxShadow: 'none'
  },
  img: {
    width: 50,
    marginRight: 20
  },
  title: {
    flexGrow: 1,
    // color: '#784ffe',
    [theme.breakpoints.down('xs')]: {
      fontSize: 0,
      // display: 'none'
    },
  },
  wrongChain: {
    flexGrow: 1,
    margin: 'auto',
    boxShadow: 'none',
    color: theme.palette.error.main
  },
  toggleBtn: {
    marginRight: 20,
    [theme.breakpoints.down('xs')]: {
      marginRight: 5,
    },
  }
}));

export default Navbar;