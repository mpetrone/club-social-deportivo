import { useState } from "react";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { TextField } from '@material-ui/core';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { parseUnits } from "@ethersproject/units";
import Divider from '@material-ui/core/Divider';

const NoMember = ({writeContracts, tx}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [newFirsname, setNewFirsname] = useState("loading...");
  const [newLastname, setNewLastname] = useState("loading...");
  const [newImgUrl, setNewImgUrl] = useState("loading...");

  return (
  	<div>
	  	<Typography variant="h6">
	      	No eres miembro todavia! :(
	    </Typography>
	    <div className={classes.formular}>
		    <Typography variant="h6" className={classes.margin}>
		      	Formulario de membresia
		    </Typography>
		    <Divider/>
		    <TextField 
		    	fullWidth
		    	label="Nombre" 
		    	variant="filled"
		    	color="secondary"
		    	required
		    	className={classes.margin}
		    	onChange ={ (e) =>{setNewFirsname(e.target.value)}} 
		    />
		    <TextField 
		    	fullWidth
		    	label="Apellido" 
		    	variant="filled"
		    	color="secondary"
		    	required
		    	className={classes.margin}
		    	onChange ={ (e) =>{setNewLastname(e.target.value)}} 
		    />
		    <TextField 
		    	fullWidth
		    	label="Url de imagen" 
		    	variant="filled"
		    	color="secondary"
		    	required
		    	className={classes.margin}
		    	onChange ={ (e) =>{setNewImgUrl(e.target.value)}} 
		    />
		  </div>
		  <div className={classes.button}>
				<IconButton
	        edge="start"
	        color="inherit"
	        aria-label="mode"
	        onClick={() => {
	        	tx(writeContracts.Memberships
	        		.createMembership(newFirsname, newLastname, newImgUrl, { value: parseUnits("1", "gwei") }))
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
    marginTop: theme.spacing(8),
    textAlign: 'left'
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
  	textAlign: 'right'
  }
}));

export default NoMember;