import { useContractLoader } from "../hooks/ContractLoader";
import { useContractReader } from "../hooks/ContractReader";
import { Transactor } from "../hooks/Transactor";
import NoHuman from './NoHuman';
import NoMember from './NoMember';
import MainMember from './MainMember';

const MainComponent = ({darkMode, injectedProvider, localProvider, userAddress, network}) => {
  const readContracts = useContractLoader(network, localProvider)
  const writeContracts = useContractLoader(network, injectedProvider)
  const isMember = useContractReader(readContracts, "Memberships", "isMember", [userAddress], [readContracts, userAddress])
  const isHuman = useContractReader(readContracts, "ProofOfHumanityMock", "isRegistered", [userAddress], [readContracts, userAddress])
  const tx = Transactor(injectedProvider)

  const component = () => {
    if(!isHuman) return <NoHuman writeContracts={writeContracts} userAddress={userAddress} tx={tx} />
    else if(!isMember) return <NoMember writeContracts={writeContracts} tx={tx} />
    else return <MainMember readContracts={readContracts} writeContracts={writeContracts} tx={tx} userAddress={userAddress}/>  
  }

  return (
    <div>
      { component() }
    </div>
  );
}

export default MainComponent;
