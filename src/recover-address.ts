import {ethers} from 'ethers';
import yargs from 'yargs/yargs';
import {strToHex} from './utils';

const argv = yargs(process.argv.slice(2))
  .options({
    message: {type: 'string', demandOption: true},
    r: {type: 'string', demandOption: true},
    s: {type: 'string', demandOption: true},
    v: {choices: [0, 1], demandOption: true},
  })
  .parseSync();

const {message, r, s, v} = argv;

const recoveredAddress = ethers.utils.recoverAddress(`0x${strToHex(message)}`, {
  r: `0x${r}`,
  s: `0x${s}`,
  v: v,
});

console.log({recoveredAddress});
