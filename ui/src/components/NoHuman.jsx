import { useState } from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const NoHuman = ({writeContracts, userAddress, tx, updateState}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  async function onClick() {
    setOpen(true)
    const result = await tx(writeContracts.ProofOfHumanityMock.addHuman(userAddress))
    if(result){
      writeContracts["ProofOfHumanityMock"].once("NewHuman", (address) => {
        console.log("NewHuman: " + address)
        if(address === userAddress) {
          setOpen(false)
          updateState("human made")
        }
      })
    } else {
      setOpen(false)
    }
  }

  return (
  	<div>
    	<Typography variant="h6">
        	No eres Humano! :(   
      </Typography>
      <br/>
      <Typography variant="h6">
      Dado que te encuentras en una red de testing, no podemos verificar si eres humano con el contrato real de Proof of Humanity
      </Typography>
      <Typography variant="h6">
      Para esto hemos creado un registro propio de prueba
            Quieres ser humano? Haz click en el boton debajo
      </Typography>
      <IconButton
            edge="start"
            color="inherit"
            aria-label="mode"
            onClick={onClick}
      >
      	<AddCircleIcon htmlColor={theme.custom.palette.iconColor} />
      </IconButton>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>    
	 </div>
  );
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.main
  }  
}));

export default NoHuman;