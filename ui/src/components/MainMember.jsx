import { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import dynamic from "next/dynamic";
const Carnet = dynamic(() => import("./Carnet"), {
  ssr: false,
});
const Proposals = dynamic(() => import("./Proposals"), {
  ssr: false,
});
const NewProposal = dynamic(() => import("./NewProposal"), {
  ssr: false,
});
const Delegation = dynamic(() => import("./Delegation"), {
  ssr: false,
});

const MainMember = ({readContracts, writeContracts, tx, userAddress}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [selected, setSelected] = useState(0);

  const handleChange = (event, newValue) => {
    setSelected(newValue);
  };

  return (
  	<div>
			<Typography variant="h5">
		        Felicitaciones
		        eres miembro de Dao FC
		  </Typography>
			<Paper square>
			  <Tabs
			    className={classes.paper}  
			    value={selected}
			    indicatorColor='secondary'
			    onChange={handleChange}
			    variant="fullWidth"
			  >
			    <Tab label="Carnet" />
			    <Tab label="Propuestas" />
			    <Tab label="Nueva Propuesta" />
			    <Tab label="Delegar Voto" />
			  </Tabs>
			</Paper>
			<div className={classes.root} >
				{selected == 0 ? <Carnet readContracts={readContracts} userAddress={userAddress}/> : "" }
				{selected == 1 ? <Proposals readContracts={readContracts} userAddress={userAddress} writeContracts={writeContracts} tx={tx}/> : "" }
				{selected == 2 ? <NewProposal writeContracts={writeContracts} tx={tx} setSelected={setSelected} /> : "" }
				{selected == 3 ? <Delegation readContracts={readContracts} userAddress={userAddress} writeContracts={writeContracts} tx={tx}/> : "" }  
			</div>	
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(12),
		display: 'flex',
		justifyContent: 'center'
	},
  paper: {
    marginTop: theme.spacing(8),
    backgroundColor: theme.palette.background.highlight
  }
}));


export default MainMember;