const {default: axios} = require('axios');
const bitcore = require('bitcore-lib');
const PublicKey = require('bitcore-lib/lib/publickey');
const Script = require('bitcore-lib/lib/script/script');
const sighash = require('bitcore-lib/lib/transaction/sighash');
const {ethers} = require('ethers');
const {computePublicKey} = require('ethers/lib/utils');

/**
 * Get address and public key from signature
 */

const getAddress = () => {
  const outputSig = {
    r: 'f378da56db6a922265ec911cffd5938bb47a80cf770adb37df88c1a11420a497',
    s: '799ee6cbafa1602e0fd85dcf746b361d126764b676b03a479a9682c0e304d4ce',
    v: 0,
  };

  const messageHash =
    '3fa9ca6d4599f122f3cb2137dbb247bc611e3520627150638517cb1f29f30e05';

  const publicKey = ethers.utils.recoverPublicKey(`0x${messageHash}`, {
    r: `0x${outputSig.r}`,
    s: `0x${outputSig.s}`,
    v: outputSig.v,
  });

  const pubk = computePublicKey(publicKey, true).replace('0x', '');
  const pubkeycompressed = new PublicKey(pubk, {
    network: bitcore.Networks.testnet,
  });

  return pubkeycompressed.toAddress().toString();
};

const getHashTx = async (from, to, amountToSend) => {
  const sochain_network = 'BTCTEST';

  // const privateKey = '93F2mUJPKbXW8Q9cMNz4ZmpsjgTbNjrMeCaUesTPE7k1DFhSmnk';
  const sourceAddress = from;

  const response = await axios.get(
    `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`,
    {
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }
  );
  //   let totalAmountAvailable = 0;

  const transaction = new bitcore.Transaction();
  const inputs = [];
  const utxos = response.data.data.txs;
  for (const element of utxos) {
    const utxo = {};
    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
    utxo.script = element.script_hex;
    utxo.address = response.data.data.address;
    utxo.txId = element.txid;
    utxo.outputIndex = element.output_no;
    // totalAmountAvailable += utxo.satoshis;
    inputs.push(utxo);
  }
  //Set transaction input
  transaction.from(inputs);

  // set the recieving address and the amount to send
  transaction.to(to, amountToSend);
  return inputs.map((utxo, index) => {
    const signH = sighash.sighash(transaction, 1, index, Script(utxo.script));
    const messageHash = bitcore.crypto.BN.fromBuffer(signH, {
      endian: 'little',
    }).toString('hex');
    return messageHash;
  });
};

const address = getAddress();
console.log(address);

getHashTx(address, 'mupSF1XLfXrXhwiydQ6ZC1r6NFEXP2oefT', 1500).then(
  messages => {
    console.log(messages);
  }
);
