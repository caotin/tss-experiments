import {ethers} from 'ethers';
import {keccak256, serializeTransaction} from 'ethers/lib/utils';

const provider = new ethers.providers.JsonRpcProvider({
  url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
});

const getRawTx = async ({
  from,
  to,
  value,
  gasPrice,
  gasLimit = ethers.utils.hexlify(21000),
}: any) => {
  const txCount = await provider.getTransactionCount(from);

  const encode = serializeTransaction({
    chainId: 5,
    gasLimit,
    gasPrice,
    to,
    value: ethers.utils.parseEther(value).toHexString(),
    data: '0x',
    nonce: txCount,
  });
  const message = keccak256(encode);
  return message;
};

getRawTx({
  from: '0xbFa4081f4e84373109f846D911Af5aA0552099a8',
  to: '0xc9af69904b4ba7f0fb69ab1a8719bd8950265e73',
  value: '0.001',
  gasPrice: ethers.utils.parseUnits('1.0', 'gwei').toHexString(),
}).then(console.log);
