import { useContractLoader } from "../hooks/contractLoader";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';

const NoHuman = ({writeContracts, userAddress, tx}) => {
  const theme = useTheme();
  
  return (
  	<div>
  	<Typography variant="h6">
      	No eres Humano! :(
    </Typography>
    <Typography variant="h6">
          Quieres ser humano?
    </Typography>
    <IconButton
          edge="start"
          color="inherit"
          aria-label="mode"
          onClick={() => {
          	tx(writeContracts.ProofOfHumanityMock.addHuman(userAddress))
          }}
    >
    	<AddCircleIcon htmlColor={theme.custom.palette.iconColor} />
    </IconButton>
	</div>
  );
}

export default NoHuman;