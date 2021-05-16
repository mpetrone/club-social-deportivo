import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { TextField } from '@material-ui/core';
import { useContractReader } from "../hooks/ContractReader";

const Delegation = ({readContracts, userAddress, writeContracts, tx}) => {
  const classes = useStyles();
  const theme = useTheme();
  const delegated = useContractReader(readContracts, "Votes", "voteDelegation", [userAddress], [userAddress]);
  const delegationsReceived = useContractReader(readContracts, "Votes", "getDelegationsReceived", [userAddress], [userAddress]);
  const [newDelegate, setNewDelegate] = useState("loading...");

  const delegationForm = () => {
    return (
      <div>
        <Typography variant="h6">
            Delega tu voto a otro miembro
        </Typography>
        <TextField 
          fullWidth
          label="Direccion" 
          variant="filled"
          color="secondary"
          required
          className={classes.margin}
          onChange ={ (e) =>{setNewDelegate(e.target.value)}} 
        />
        <div className={classes.button}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="mode"
            onClick={() => {
              tx(writeContracts.Votes
                .delegate(newDelegate))
            }}
          >
            <AddCircleIcon htmlColor={theme.custom.palette.iconColor} />
          </IconButton>
        </div>
      </div>
    )
  }

  const isAddressZero = (address) => {
    return !address || ethers.constants.AddressZero === address;
  }

  return (
    <div>
      <Typography variant="h5">
        Votos que te han delegado {delegationsReceived ? delegationsReceived.length : 0}
      </Typography>
      <br/>
      <Typography variant="h5">
        {!isAddressZero(delegated) ? "Has delegado tu voto a " + delegated : delegationForm()} 
      </Typography>

    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  }
}));

export default Delegation;