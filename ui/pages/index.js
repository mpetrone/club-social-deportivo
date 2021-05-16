import Link from 'next/link';
import {  StaticJsonRpcProvider } from "@ethersproject/providers";
import { useContractLoader } from "../src/hooks/contractLoader";
import { useContractReader } from "../src/hooks/ContractReader";
import { Transactor } from "../src/hooks/Transactor";
import NoConnection from '../src/components/NoConnection';
import NoHuman from '../src/components/NoHuman';
import NoMember from '../src/components/NoMember';
import MainMember from '../src/components/MainMember';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const localProvider = new StaticJsonRpcProvider

const Index = ({darkMode, injectedProvider, userAddress}) => {
  const classes = useStyles();
  const readContracts = useContractLoader(localProvider)
  const writeContracts = useContractLoader(injectedProvider)
  const isMember = useContractReader(readContracts, "Memberships", "isMember", [userAddress], [readContracts, userAddress])
  const isHuman = useContractReader(readContracts, "ProofOfHumanityMock", "isRegistered", [userAddress], [readContracts, userAddress])
  const tx = Transactor(injectedProvider)

  const component = () => {
    if(userAddress == "") return <NoConnection />
    else if(!isHuman) return <NoHuman writeContracts={writeContracts} userAddress={userAddress} tx={tx} />
    else if(!isMember) return <NoMember writeContracts={writeContracts} tx={tx} />
    else return <MainMember readContracts={readContracts} writeContracts={writeContracts} tx={tx} userAddress={userAddress}/>  
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
