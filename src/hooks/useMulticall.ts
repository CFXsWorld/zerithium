import { Contract, InterfaceAbi } from 'ethers';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { ethers } from 'ethers';
import useProvider from './useProvider';
export interface ContractCall {
  abi: InterfaceAbi;
  address: string;
  name: string;
  values: any[];
}

const useMulticall = () => {
  const { address, abi } = ZERITHIUM_SLC_CONTRACT.mutilCall;
  const { rpc } = useProvider();

  const multiCall = async (calls: ContractCall[]) => {
    if (!calls.length) {
      console.warn('Calls must be definition');
      return;
    }

    const provider = new ethers.JsonRpcProvider(rpc);

    const multicallContract = new Contract(address, abi, provider);

    const promises = [];
    for (const call of calls) {
      const contract = new Contract(call.address, call.abi, provider);
      promises.push([
        call.address,
        contract.interface.encodeFunctionData(call.name, call.values),
      ]);
    }
    return await multicallContract.aggregate.staticCall(promises);
    // return await multicallContract.tryAggregate.staticCall(true, promises);
  };
  return { multiCall };
};

export default useMulticall;
