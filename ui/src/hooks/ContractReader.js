import { useState, useEffect } from "react";
import { useOnBlock } from "./OnBlock";

const DEBUG = true;

export function useContractReader(contracts, contractName, functionName, args, deps) {
  const [value, setValue] = useState();

  const validDeps = (deps) => {
    const filtered = deps.filter((e) => { return e && e != "" })
    return filtered.length == deps.length;
  }

  const updateValue = async () => {
    if(!validDeps(deps)) return;
    try {
      let newValue;
      if (DEBUG) console.log("CALLING ", contractName, functionName, "with args", args);
      if (args && args.length > 0) {
        newValue = await contracts[contractName][functionName](...args);
        if (DEBUG) console.log("contractName", contractName, "functionName", functionName, "args", args, "RESULT:", newValue);
      } else {
        newValue = await contracts[contractName][functionName]();
      }
      if (newValue !== value) {
        setValue(newValue);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Only pass a provider to watch on a block if we have a contract and no PollTime
  useOnBlock(
    (contracts && contracts[contractName]) && contracts[contractName].provider,
    () => {
    if (contracts && contracts[contractName]) {
      updateValue()
    }
  })

  useEffect(() => {
    updateValue()
  }, deps)

  return value;
}
