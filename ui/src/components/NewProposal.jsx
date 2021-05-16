import { useState } from "react";
import { useContractLoader } from "../hooks/contractLoader";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { TextField } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { parseUnits } from "@ethersproject/units";
import Divider from '@material-ui/core/Divider';

const NewProposal = ({writeContracts, tx}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [newTitle, setNewTitle] = useState("loading...");
  const [newDescription, setNewDescription] = useState("loading...");

  return (
    <div>
      <div className={classes.formular}>
        <Typography variant="h4" className={classes.margin}>
            Crea una nueva propuesta
        </Typography>
        <Divider/>
        <TextField 
          fullWidth
          label="Titulo" 
          variant="filled"
          required
          color="secondary"
          className={classes.margin}
          onChange ={ (e) =>{setNewTitle(e.target.value)}} 
        />
        <TextField 
          fullWidth
          label="Descripcion" 
          variant="filled"
          multiline
          required
          color="secondary"
          rows={4}
          className={classes.margin}
          onChange ={ (e) =>{setNewDescription(e.target.value)} } 
        />
      </div>
      <div className={classes.button}>
        <IconButton
          edge="start"
          color="inherit"

          aria-label="mode"
          onClick={() => {
            tx(writeContracts.Proposals
              .createProposal(newTitle, newDescription))
          }}
        >
          <AddCircleIcon htmlColor={theme.custom.palette.iconColor} />
        </IconButton>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  formular: {
    width: '100%',
    textAlign: 'left'
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    textAlign: 'right'
  }
}));

export default NewProposal;