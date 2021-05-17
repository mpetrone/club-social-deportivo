import { useState, useEffect } from 'react';
import { useContractLoader } from "../src/hooks/ContractLoader";
import { useContractReader } from "../src/hooks/ContractReader";
import { Transactor } from "../src/hooks/Transactor";
import NoConnection from '../src/components/NoConnection';
import NoContractDeployed from '../src/components/NoContractDeployed';
import MainComponent from '../src/components/MainComponent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const Index = ({darkMode, injectedProvider, localProvider, userAddress, network}) => {
  const classes = useStyles();
  const [areContractsDeployed, setAreContractsDeployed] = useState(false);

  useEffect(() => {
    if(network){
      console.log(network)
      try {
        require(`../src/contracts/${network.name}/Memberships.bytecode.js`);
        setAreContractsDeployed(true)
      } catch (e) {
        setAreContractsDeployed(false)
      }
    }
  }, [network])

  const component = () => {
    if(userAddress === '') return <NoConnection />
    else if(!areContractsDeployed) return <NoContractDeployed />
    else return <MainComponent  darkMode={darkMode}
          injectedProvider={injectedProvider}
          userAddress={userAddress}
          localProvider={localProvider}
          network={network}/>  
  }

  return (
    <main className={classes.main}>
      <div>
        <Typography variant="h3">
          Bienvenido a Dao FC!
        </Typography>
        <Divider />
        <Typography variant="h5">
          Un club de y para los socios
        </Typography>
        <Container className={classes.container}>
          { component() }
        </Container>  
      </div>
    </main>
  );
}

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    margin: '100px auto',
    maxWidth: 1100,
    textAlign: 'center'
  },
  container: {
    marginTop: theme.spacing(8)
  },
  text: {
    fontSize: 18
  }
}));

export default Index;
