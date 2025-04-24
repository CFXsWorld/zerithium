import { Contract, JsonRpcProvider } from 'ethers';
import CIS from '@/contracts/abi/CIS.json';
import { CHAINS } from '@/contracts/chains.tsx';
const useCISContract = () => {
  const rpc = CHAINS.zeroGTest.rpc[0];
  const provider = new JsonRpcProvider(rpc);
  const contract = new Contract(CIS.address, CIS.abi, provider);

  const getCISId = (address: string) => {
    return contract.getAddrId(address);
  };

  const getAddrByCISId = async (id: string) => {
    const result = await contract.getIdService(id).catch(() => {});
    if (result && result[1] !== '0x0000000000000000000000000000000000000000') {
      return result[1];
    }
  };

  return {
    getCISId,
    contract,
    getAddrByCISId,
  };
};

export default useCISContract;
