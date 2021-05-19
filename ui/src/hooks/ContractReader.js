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
      console.log(e, contractName, functionName, args, deps);
    }
  }


  useEffect(() => {
    updateValue()
  }, deps)

  return value;
}
