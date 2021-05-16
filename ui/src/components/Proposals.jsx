import { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useContractReader } from "../hooks/ContractReader";
import dynamic from "next/dynamic";
const Proposal = dynamic(() => import("./Proposal"), {
  ssr: false,
});

const Proposals = ({readContracts, userAddress, writeContracts, tx}) => {
  const proposals = useContractReader(readContracts, "Proposals", "getAllProposals", [], [userAddress]);
  console.log(proposals)
  const voteButtons = () => {
    return (
      <div>
        <Button size="small" color="inherit">
          Share
        </Button>
        <Button size="small" color="inherit">
          Learn More
        </Button>
      </div>  
    )
  }

  const parseProposal = (proposal) => {
    return ( 
      <Proposal 
        readContracts={readContracts} 
        userAddress={userAddress} 
        proposal={proposal}
        writeContracts={writeContracts} 
        tx={tx}
    /> )
  }

  const noProposals = () => {
    return (
      <Typography variant="h6">
        No hay propuestas todavia
      </Typography>
    )
  }

  return (
    <div>
      <Typography variant="h4">
        Propuestas
      </Typography>
      {proposals && proposals.length != 0 ? proposals.map(parseProposal) : noProposals()}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
}));

export default Proposals;