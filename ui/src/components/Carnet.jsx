import { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { useContractReader } from "../hooks/ContractReader";


const Carnet = ({readContracts, userAddress}) => {
  const classes = useStyles();
  const memberInfo = useContractReader(readContracts, "Memberships", "members", [userAddress], [readContracts, userAddress]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [imgUrl, setIUmgUrl] = useState("");
  const [carnetId, setCarnetId] = useState(0);

  useEffect(() => {
    if(memberInfo){
      setFirstname(memberInfo.firstname)
      setLastname(memberInfo.lastname)
      setIUmgUrl(memberInfo.imgUrl)
      setCarnetId(memberInfo.carnetId.toNumber())
    }
  }, [memberInfo])

  return (
    <div>
      <Card className={classes.root}  >
        <CardMedia
          className={classes.cover}
          image={imgUrl}
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