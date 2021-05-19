import { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { useContractReader } from "../hooks/ContractReader";
import dynamic from "next/dynamic";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const Proposals = ({readContracts, userAddress, proposal, writeContracts, tx}) => {
  const classes = useStyles();
  const id = proposal.proposalId.toNumber();
  const [update, setUpdate] = useState("Init");
  const [open, setOpen] = useState(false);
  const hasVoted = useContractReader(readContracts, "Votes", "hasVoted", [userAddress, id], [userAddress, update]);
  const votes = useContractReader(readContracts, "Votes", "getAllProposalVotes", [id], [userAddress, update]);
  const [votesNum, setVotesNum] = useState(0);
  

  useEffect(() => {
    if(votes){
      setVotesNum(votes.length)
    }
  }, [votes])

  async function onClick(inFavor) {
    setOpen(true)
    const result = await tx(writeContracts.Votes.vote(id, inFavor))
    if(result){
      writeContracts["Votes"].once("VoteMade", (voter, proposalId, inFavor) => {
        console.log("VoteMade: ", voter, proposalId, inFavor)
        if(userAddress === voter) {
          setOpen(false)
          setUpdate("new vote" + proposalId)
        }
      })
    } else {
      setOpen(false)
    }
  }

  const voteButtons = () => {
    return (
      <div>
        <Typography variant='h6'>
          Votar
        </Typography>
        <Button 
          size="small" 
          color="inherit"
          onClick={() => onClick(false)}
        >
          En contra
        </Button>
        <Button 
          size="small"
          color="inherit"
          onClick={() => onClick(true)}
        >
          A favor
        </Button>
      </div>  
    )
  }

  return (
    <div>
      <Card className={classes.proposal}>
        <div className={classes.header}>
          <Typography>
            Propuesta Nro: {id}
          </Typography>
          <Typography>
            Cantidad de votos: {votesNum}
          </Typography>
        </div>
        <Typography className={classes.title} variant="h5">
          {proposal.title}
        </Typography>
        <br/>
        <Typography className={classes.description} variant="body1" color="inherit" component="p">
          {proposal.description}
        </Typography>
        <CardActions className={classes.actions}>
          {hasVoted ? "Ya votaste esta propuesta!" : voteButtons()}
        </CardActions>
      </Card>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>   
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  proposal: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    margin: theme.spacing(3),
    minWidth: theme.spacing(50),
    minHeight: theme.spacing(35),
    backgroundColor: theme.palette.background.highlight
  },
  header: {
    margin: theme.spacing(1),
    color: 'inherit',
    display: 'inherit',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  title: {
    margin: theme.spacing(1),
    color: 'inherit'
  },
  description: {
    margin: theme.spacing(1),
    color: 'inherit',
    flexGrow: 2
  },
  actions: {
    display: 'inherit',
    justifyContent: 'flex-end'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.main
  } 
}));

export default Proposals;