const bitcoin = require('bitcoinjs-lib');
const {ethers} = require('ethers');
const bitcore = require('bitcore-lib');
const Signature = bitcore.crypto.Signature;
const {default: axios} = require('axios');
const {default: BigNumber} = require('bignumber.js');

const TESTNET = bitcoin.networks.testnet;

// R: Secp256k1Scalar { purpose: "from_bigint", fe: Zeroizing(Some(SK(SecretKey(5a9604ca0b6a03f8b4936bec7756f2379454dd72f14097969a253c5df6421f7a)))) }
// s: Secp256k1Scalar { purpose: "add", fe: Zeroizing(Some(SK(SecretKey(313068b9107660191d7b901af4bfae41ed76891fa2aefa80eafedc8d24654ae2)))) }

// recid: 1

const r = '5a9604ca0b6a03f8b4936bec7756f2379454dd72f14097969a253c5df6421f7a';
const s = '313068b9107660191d7b901af4bfae41ed76891fa2aefa80eafedc8d24654ae2';
const v = 1;

const signature = ethers.utils.recoverPublicKey(
  '0x51bec4e8787e255439a3b7a176686f926225aa47ebc15e98953ca3e2fcdfdc0c',
  {
    r: `0x${r}`,
    s: `0x${s}`,
    v: v,
  }
);

console.log({signature});
const pub = signature.replace('0x', '');

const {address} = bitcoin.payments.p2pkh({
  pubkey: Buffer.from(pub, 'hex'),
  network: TESTNET,
});

console.log('address', address);

const sendBitcoin = async (recieverAddress, amountToSend) => {
  const sochain_network = 'BTCTEST';

  // const privateKey = '93F2mUJPKbXW8Q9cMNz4ZmpsjgTbNjrMeCaUesTPE7k1DFhSmnk';
  const sourceAddress = 'mupSF1XLfXrXhwiydQ6ZC1r6NFEXP2oefT';
  const satoshiToSend = BigNumber(amountToSend)
    .multipliedBy(100000000)
    .toNumber();
  let fee = 0;
  let inputCount = 0;
  const outputCount = 2;
  const response = await axios.get(
    `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`,
    {
      headers: {
        'Accept-Encoding': 'application/json',
      },
    }
  );
  const transaction = new bitcore.Transaction();
  let totalAmountAvailable = 0;

  const inputs = [];
  const utxos = response.data.data.txs;
  for (const element of utxos) {
    console.log(Math.floor(Number(element.value) * 100000000));
    const utxo = {};
    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
    utxo.script = element.script_hex;
    utxo.address = response.data.data.address;
    utxo.txId = element.txid;
    utxo.outputIndex = element.output_no;
    totalAmountAvailable += utxo.satoshis;
    inputCount += 1;
    inputs.push(utxo);
  }

  const transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
  // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte
  fee = transactionSize * 20;
  console.log(totalAmountAvailable - satoshiToSend - fee);
  if (totalAmountAvailable - satoshiToSend - fee < 0) {
    throw new Error('Balance is too low for this transaction');
  }

  //Set transaction input
  transaction.from(inputs);

  // set the recieving address and the amount to send
  transaction.to(recieverAddress, satoshiToSend);

  // Set change address - Address to receive the left over funds after transfer
  transaction.change(sourceAddress);

  //manually set transaction fees: 20 satoshis per byte
  transaction.fee(fee);
  const sig = Signature.fromCompact(
    Buffer.from(
      '1c5a9604ca0b6a03f8b4936bec7756f2379454dd72f14097969a253c5df6421f7a313068b9107660191d7b901af4bfae41ed76891fa2aefa80eafedc8d24654ae2',
      'hex'
    )
  );
  const redeemScript = bitcore.Script.buildMultisigOut(
    bitcore.PublicKey(pub),
    1,
    {noSorting: true}
  );
  console.log({redeemScript});
  const scriptSig = bitcore.Script.buildP2SHMultisigIn(
    [bitcore.PublicKey(pub)],
    1,
    [sig.toTxFormat()],
    {noSorting: true}
  );
  console.log({scriptSig});
  // Sign transaction with your private key

  // console.log('transaction', transaction.toString());
  // console.log(sig.toTxFormat().toString('hex'));
};

sendBitcoin('2N2XmFmHFXStyepHW3KtesFZdhbeRRCrMNP', 0.00001);
