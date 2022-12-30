const {default: axios} = require('axios');
const bitcore = require('bitcore-lib');
const PublicKey = require('bitcore-lib/lib/publickey');
const {ethers} = require('ethers');
const {computePublicKey} = require('ethers/lib/utils');

// ing(Some(SK(SecretKey(b7ac28293cec3c179a9f33a5610550e223b22c95c8580d741325a1701b8204d9)))) }
// s:  { purpose: "add", fe: Zeroizing(Some(SK(SecretKey(36febb8387fe00fc70dd1e0496cdd680e8f403993f526b7bc438ef2fd3147549)))) }

// recid: 0

const signatures = [
  {
    r: 'b7ac28293cec3c179a9f33a5610550e223b22c95c8580d741325a1701b8204d9',
    s: '36febb8387fe00fc70dd1e0496cdd680e8f403993f526b7bc438ef2fd3147549',
    v: 0,
    message: 'e44fae4e287a132940fdf7399c8834fa94b8839cfe8bba292e69ecf619e4f56c',
  },
];

const getAddress = outputSig => {
  const publicKey = ethers.utils.recoverPublicKey(`0x${outputSig.message}`, {
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

async function sendTx(transaction) {
  const sochain_network = 'BTCTEST';
  const result = await axios({
    method: 'POST',
    url: `https://chain.so/api/v2/send_tx/${sochain_network}`,
    data: {
      tx_hex: transaction,
    },
    headers: {
      'Accept-Encoding': 'application/json',
    },
  });

  return result.data.data;
}

const sendHashTx = async (from, to, amountToSend) => {
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

  signatures.forEach((sig, index) => {
    const publicKey = ethers.utils.recoverPublicKey(`0x${sig.message}`, {
      r: `0x${sig.r}`,
      s: `0x${sig.s}`,
      v: sig.v,
    });

    const pubk = computePublicKey(publicKey, true).replace('0x', '');
    const pubkeycompressed = new PublicKey(pubk, {
      network: bitcore.Networks.testnet,
      compressed: true,
    });

    const sigObj = bitcore.crypto.Signature.fromCompact(
      Buffer.from(`1c${sig.r}${sig.s}`, 'hex')
    );

    const signature = {
      signature: sigObj,
      inputIndex: index,
      sigtype: 1,
      publicKey: pubkeycompressed,
    };
    transaction.applySignature(signature);
  });

  return await sendTx(transaction.serialize());
};

const address = getAddress(signatures[0]);
console.log(address);

sendHashTx(address, 'mupSF1XLfXrXhwiydQ6ZC1r6NFEXP2oefT', 1500).then(hash => {
  console.log(hash);
});
