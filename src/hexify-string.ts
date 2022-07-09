import yargs from 'yargs';
import {strToHex} from './utils';

const argv = yargs(process.argv.slice(2))
  .options({
    message: {type: 'string', demandOption: true},
  })
  .parseSync();

console.log(strToHex(argv.message));
