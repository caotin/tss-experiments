const {default: axios} = require('axios');
const bitcore = require('bitcore-lib');
const PublicKey = require('bitcore-lib/lib/publickey');
const Script = require('bitcore-lib/lib/script/script');
const sighash = require('bitcore-lib/lib/transaction/sighash');
const {ethers} = require('ethers');
const {computePublicKey} = require('ethers/lib/utils');

String.prototype.rjust = function (num, padding) {
  if (!padding) padding = ' ';
  let s = this.toString();
  if (1 !== padding.length) throw new Error('Padding must be one character.');
  if (s.length >= num) return s;
  for (let i = 0; i <= num - s.length; i++)
    s = padding + s; /*from  w  w  w .j  a va2  s  .  c  om*/
  return s;
};
const utxo = [
  {
    txId: 'dc431bb9b66ab914ff9c98183d4707d217d5c710f8bac9568064d0e993af62a2',
    outputIndex: 0,
    address: 'msSqTLkQq4kxbSxwYfdbJBqPK73Y9JjMK5',
    script: '76a91482da22cb8f6ded70d6dba0552294ef7d77d64b5488ac',
    satoshis: 9238,
  },
];

const transaction = new bitcore.Transaction()
  .from(utxo)
  .to('mupSF1XLfXrXhwiydQ6ZC1r6NFEXP2oefT', 1500);

console.log('rawUnsignedTx', transaction.toBuffer().toString('hex'));

/**
 * @param transaction — the transaction to sign
 * @param sighashType — the type of the hash
 * @param inputNumber — the input index for the signature
 * @param subscript — the script that will be signed
 */
const signH = sighash.sighash(transaction, 1, 0, Script(utxo[0].script));

const messageHash = bitcore.crypto.BN.fromBuffer(signH, {
  endian: 'little',
}).toString('hex');

console.log('message', messageHash);

const signatures = [
  {
    r: '70bca7132b290c703560fb9bff0f289e23cfc275e5fe58e1c553971bae80d85f',
    s: '1497c06952355027f68ed35863dedd79876efa0b95eeda0bc815ef1275611c4e',
    v: 1,
  },
];

// R: Secp256k1Scalar { purpose: "from_bigint", fe: Zeroizing(Some(SK(SecretKey(6297d5a986e4df2035516039004c56772b73572b52ef84838c9883677fcf5eb2)))) }
// s: Secp256k1Scalar { purpose: "from_bigint", fe: Zeroizing(Some(SK(SecretKey(7cc712c5ff320bc54ff3df41e91f3a8b1269a8bd6ae03f681446d84975477bd4)))) } 

// recid: 1

const [firstSig] = signatures;

const publicKey = ethers.utils.recoverPublicKey(`0x${messageHash}`, {
  r: `0x${firstSig.r}`,
  s: `0x${firstSig.s}`,
  v: firstSig.v,
});

const pubkey = new PublicKey(publicKey.replace('0x', ''), {
  network: bitcore.Networks.testnet,
});

console.log({publicKey});
console.log({
  address: pubkey.toAddress(bitcore.Networks.testnet).toString(),
});

// const a = bitcore.crypto.Signature.fromDER(
//   Buffer.from(`30440220${r}0220${s}`, 'hex')
// );

// a.set({nhashtype: a.SIGHASH_ALL});

// console.log('ssssss', a.r.toString('hex'));
// console.log('ssssss', a.toDER().toString('hex'));
const DER = `3045022100${firstSig.r}0220${firstSig.s}01`;
const pubk = computePublicKey(publicKey, true).replace('0x', '');
const pubkeycompressed = new PublicKey(pubk, {
  network: bitcore.Networks.testnet,
});

console.log('pubkeycompressed', pubkeycompressed.toAddress().toString());

console.log({computePublicKey: pubk});

const scriptsig =
  (DER.length / 2).toString(16) + DER + (pubk.length / 2).toString(16) + pubk;

console.log({DER});

// function tx(scriptsig) {
//   // # Need to calculate a byte indicating the size of upcoming scriptsig in bytes (rough code but does the job)
//   const size = (scriptsig.length / 2).toString(16).rjust(2, '0');
//   // return `0200000001740d800a6e3bcf8b455a15b43ee2b56b261737210141263e08e90a1218d09957000000006b483045022100dc41ac1d4eba97d30aff470ec8e51999511eb05794dd71f2c23ba02664c56113022049d96be89c9f1c66d9424549a84a9a5128bd86bfff9ab0bd22656859abd43567012103410e33d6a820b054c7daacb80069e213e3ffb47cecfaf101e6a7052852b44a80ffffffff01e8030000000000001976a9149ce02967583d33dd9747385c2062ae03053aec0488ac00000000`
//   // # Raw unsigned transaction data with the scriptsig field (you need to know the correct position)
//   return `020000000178f970c3219404af5c4a7139c53a05eeaa969d67ef56d98c6e0c62641e240cde00000000${size}${scriptsig}ffffffff01e8030000000000001976a9149ce02967583d33dd9747385c2062ae03053aec0488ac00000000`;
//   // return `020000000178f970c3219404af5c4a7139c53a05eeaa969d67ef56d98c6e0c62641e240cde00000000${size}${scriptsig}ffffffff01e8030000000000001976a9149ce02967583d33dd9747385c2062ae03053aec0488ac00000000`;
//   // return `020000000178f970c3219404af5c4a7139c53a05eeaa969d67ef56d98c6e0c62641e240cde01000000${size}${scriptsig}ffffffff01e8030000000000001976a9149ce02967583d33dd9747385c2062ae03053aec0488ac00000000`
// }

// console.log(tx(scriptsig));

// const newTx = new bitcore.Transaction(transaction.toBuffer().toString('hex'));
// *
// * @param {Object} signature
// * @param {number} signature.inputIndex
// * @param {number} signature.sigtype
// * @param {PublicKey} signature.publicKey
// * @param {Signature} signature.signature

const a = bitcore.crypto.Signature.fromCompact(
  Buffer.from(`1c${firstSig.r}${firstSig.s}`, 'hex')
);
console.log(a);
const signature = {
  signature: a,
  inputIndex: 0,
  sigtype: 1,
  publicKey: pubkeycompressed,
};

transaction.applySignature(signature);
// newTx.inputs[0].output = bitcore.Transaction.Output({
//   satoshis: 13143,
//   script: utxo[0].script,
// });
// // newTx.verify()
console.log(transaction.serialize());

async function sendTx() {
  const sochain_network = 'BTCTEST';
  const result = await axios({
    method: 'POST',
    url: `https://chain.so/api/v2/send_tx/${sochain_network}`,
    data: {
      tx_hex: transaction.serialize(),
    },
    headers: {
      'Accept-Encoding': 'application/json',
    },
  });

  return result.data.data;
}

sendTx()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err.response.data);
  });

// 020000000296eda73eaf02f416d61b5e72047cdf9bf2ca245715d8abea27ff2e51773e7fd3010000006a473044022079161ed52466c660f6a4c23a2151b9b831ca66b29070e89007d2fef88f0999f902200f6d01b52e646d28c05a3d506b74283eb3659bdd05c8c05cecbab1fb14a4ed1d012103410e33d6a820b054c7daacb80069e213e3ffb47cecfaf101e6a7052852b44a80ffffffff87242f37f2ee92be2704590726d67e9782be25d07cd936c4b7e2faf446d1ef17000000006a47304402207fef91bc721c42af7fdb8dfc48013e637dbacea07f32d09622355555608d4fd4022054052a3c6e27f142b87df37af0f7095a21853d1285945ea019a15ca79499dba2012103410e33d6a820b054c7daacb80069e213e3ffb47cecfaf101e6a7052852b44a80ffffffff01e8030000000000001976a9149ce02967583d33dd9747385c2062ae03053aec0488ac0000000
