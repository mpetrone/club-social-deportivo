import { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useContractReader } from "../hooks/ContractReader";
import dynamic from "next/dynamic";

const Proposals = ({readContracts, userAddress, proposal, writeContracts, tx}) => {
  const classes = useStyles();
  const id = proposal.proposalId.toNumber();
  const hasVoted = useContractReader(readContracts, "Votes", "hasVoted", [userAddress, id], [proposal]);
  const votes = useContractReader(readContracts, "Votes", "votes", [id], [proposal]);
  console.log(votes)

  const voteButtons = () => {
    return (
      <div>
        <Button 
          size="small" 
          color="inherit"
          onClick={() => {
            tx(writeContracts.Votes
              .vote(id, false))
          }}
        >
          En contra
        </Button>
        <Button 
          size="small"
          color="inherit"
          onClick={() => {
            tx(writeContracts.Votes
              .vote(id, true))
          }}
        >
          A favor
        </Button>
      </div>  
    )
  }

  return (
    <Card className={classes.proposals}>
      <CardContent>
        <Typography className={classes.title}  color="inherit" gutterBottom>
          id: {id}
        </Typography>
        <Typography color="inherit" variant="h5">
          {proposal.title}
        </Typography>
        <br/>
        <Typography variant="body2" color="inherit" component="p">
          {proposal.description}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        {hasVoted ? "Ya votaste esta propuesta!" : voteButtons()}
      </CardActions>
    </Card>
  )
}

const useStyles = makeStyles((theme) => ({
  proposals: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.background.highlight
  },
  title: {
    textAlign: 'left'
  },
  actions: {
    textAlign: 'right',
    display: 'inherit'
  }
}));

export default Proposals;