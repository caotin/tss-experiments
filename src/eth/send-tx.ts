import {ethers} from 'ethers';
import {serializeTransaction} from 'ethers/lib/utils';
import yargs from 'yargs/yargs';

const argv = yargs(process.argv.slice(2))
  .options({
    message: {type: 'string', demandOption: true},
    r: {type: 'string', demandOption: true},
    s: {type: 'string', demandOption: true},
    v: {choices: [0, 1], demandOption: true},
  })
  .parseSync();

const {message, r, s, v} = argv;

const recoveredAddress = ethers.utils.recoverAddress(`0x${message}`, {
  r: `0x${r}`,
  s: `0x${s}`,
  v: v,
});

console.log({recoveredAddress});

const provider = new ethers.providers.JsonRpcProvider({
  url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
});

const send = async ({
  to,
  from,
  value,
  gasPrice,
  gasLimit = ethers.utils.hexlify(21000),
}: any) => {
  const txCount = await provider.getTransactionCount(from);
  const CHAIN_ID = 5; // goerli chain ID

  // build the transaction
  const rawTx = serializeTransaction(
    {
      chainId: CHAIN_ID,
      gasLimit,
      gasPrice,
      to,
      value: ethers.utils.parseEther(value).toHexString(),
      data: '0x',
      nonce: txCount,
    },
    {
      r: `0x${r}`,
      s: `0x${s}`,
      v: v,
    }
  );

  console.log(rawTx);
  try {
    const {hash} = await provider.sendTransaction(rawTx);
    console.log({hash});
  } catch (error: any) {
    console.log(error?.message);
  }
};

send({
  from: recoveredAddress,
  to: '0xc9af69904b4ba7f0fb69ab1a8719bd8950265e73',
  value: '0.001',
  gasPrice: ethers.utils.parseUnits('1.0', 'gwei').toHexString(),
});
