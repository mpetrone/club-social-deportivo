import { useState } from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { TextField } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { parseUnits } from "@ethersproject/units";
import Divider from '@material-ui/core/Divider';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const NewProposal = ({writeContracts, tx, setSelected}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [newTitle, setNewTitle] = useState("loading...");
  const [newDescription, setNewDescription] = useState("loading...");
  const [open, setOpen] = useState(false);

  async function onClick() {
    setOpen(true)
    const result = await tx(writeContracts.Proposals.createProposal(newTitle, newDescription))
    if(result){
      writeContracts["Proposals"].once("ProposalCreated", (id, title) => {
        console.log("ProposalCreated: " + title)
        if(title === newTitle) {
          setOpen(false)
          setSelected(1)
        }
      })
    } else {
      setOpen(false)
    }
  }

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
          onClick={onClick}
        >
          <AddCircleIcon htmlColor={theme.custom.palette.iconColor} />
        </IconButton>
      </div>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }  
}));

export default NewProposal;