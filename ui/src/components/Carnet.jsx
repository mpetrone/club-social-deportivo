import { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { useContractReader } from "../hooks/ContractReader";
const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const Carnet = ({readContracts, userAddress}) => {
  const classes = useStyles();
  const memberInfo = useContractReader(readContracts, "Memberships", "members", [userAddress], [readContracts, userAddress]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [carnetId, setCarnetId] = useState(0);

  const loadImage = (hash) => {
    try {
      if(hash !== ""){
        ipfs.catJSON(hash).then((data) => {
          console.log("IPFS", data)
          setIpfsHash(data)
        })
      }
    } catch (e) {
      setIpfsHash('')
      console.log("ERROR LOADING IPFS IMG!!", e);
    }
  }

  useEffect(() => {
    if(memberInfo){
      setFirstname(memberInfo.firstname)
      setLastname(memberInfo.lastname)
      setCarnetId(memberInfo.carnetId.toNumber())
      loadImage(memberInfo.imgUrl)
    }
  }, [memberInfo])

  return (
    <div>
      <Card className={classes.root}  >
        <CardMedia
          className={classes.cover}
          image={ipfsHash === '' ? '/img/nouser.jpeg' : ipfsHash}
          title="Carnet"
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="h5">
              Nombre: {firstname}
            </Typography>
            <Typography variant="h5">
              Apellido: {lastname}
            </Typography>
            <Typography variant="h5">
              Carnet Id: {carnetId}
            </Typography>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.highlight,
    minWidth: theme.spacing(70),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  content: {
  },
  cover: {
    width: 185,
    height: 180
  }
}));

export default Carnet;