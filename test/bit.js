const bitcore = require('bitcore-lib');
const { ethers } = require('ethers');
const Signature = bitcore.crypto.Signature;
const privateKey = new bitcore.PrivateKey(
  'f85a92be87c2d99f774d6aa867b92ff6a006f1def8702d602a529d4ca9fb64b0',
  bitcore.Networks.testnet
);

console.log(
  'privateKey',
  privateKey.toAddress(bitcore.Networks.testnet).toString()
);

console.log('publicKey', privateKey.toPublicKey().toString());
// const privateKey = new bitcore.PrivateKey(
//   'L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy'
// );
// const utxo = {
//   txId: 'd37f3e77512eff27eaabd8155724caf29bdf7c04725e1bd616f402af3ea7ed96',
//   outputIndex: 0,
//   address: 'mxTG4pahSiMyduw3tCCLijFjEukCqWEotg',
//   script: '76a914b9c74f466be54f0f34afb2e27c6ed51904d311d988ac',
//   satoshis: 9448,
// };

const utxo = [
  {
    txId: '5799d018120ae9083e264101213717266bb5e23eb4155a458bcf3b6e0a800d74',
    outputIndex: 0,
    address: 'mxTG4pahSiMyduw3tCCLijFjEukCqWEotg',
    script: '76a914b9c74f466be54f0f34afb2e27c6ed51904d311d988ac',
    satoshis: 13143,
  },
];
const transaction = new bitcore.Transaction()
  .from(utxo)
  .to('mupSF1XLfXrXhwiydQ6ZC1r6NFEXP2oefT', 1000)
  .sign(privateKey);

console.log('object', transaction.toBuffer().toString('hex'));

// const transactionSignature = {
//   publicKey: privateKey.toPublicKey(),
//   prevTxId: utxo[0].txId,
//   outputIndex: 1,
//   inputIndex: 0,
//   signature: Signature.fromDER(
//     Buffer.from(
//       '304402207fef91bc721c42af7fdb8dfc48013e637dbacea07f32d09622355555608d4fd4022054052a3c6e27f142b87df37af0f7095a21853d1285945ea019a15ca79499dba2',
//       'hex'
//     )
//   ),
//   sigtype: 1,
// };
// transaction.applySignature(transactionSignature);
// transaction.sign(privateKey);

// console.log('transaction signed', transaction.toObject().inputs);

// console.log(
//   'transaction.getSignature()',
//   transaction.getSignatures(privateKey)
// );

console.log('transaction.serialize()', transaction.serialize());

console.log('transaction.toObject()', transaction.toObject());
console.log('transaction.toObject()', transaction.toObject().inputs);
// output: {
//   satoshis: 9448,
//   script: '76a914b9c74f466be54f0f34afb2e27c6ed51904d311d988ac'
// }
// 483045022100be04b1f4bffa75dbd51f71a661b1c243e8b4fff943e6e0580e2bafe4cdd1640f02207e59a842c175757da78552ce5c90b64e38945aaefa6d5724aa59bab8b73e13b6012103410e33d6a820b054c7daacb80069e213e3ffb47cecfaf101e6a7052852b44a80
const signature = Signature.fromDER(
  Buffer.from(
    '3045022100dc41ac1d4eba97d30aff470ec8e51999511eb05794dd71f2c23ba02664c56113022049d96be89c9f1c66d9424549a84a9a5128bd86bfff9ab0bd22656859abd43567',
    'hex'
  )
);
console.log('signature.r', signature.r.toString('hex'));
console.log('signature.s', signature.s.toString('hex'));
console.log('signature', signature.toDER().toString('hex'));

// const newTx = new bitcore.Transaction(
//   '020000000296eda73eaf02f416d61b5e72047cdf9bf2ca245715d8abea27ff2e51773e7fd3010000006a473044022079161ed52466c660f6a4c23a2151b9b831ca66b29070e89007d2fef88f0999f902200f6d01b52e646d28c05a3d506b74283eb3659bdd05c8c05cecbab1fb14a4ed1d012103410e33d6a820b054c7daacb80069e213e3ffb47cecfaf101e6a7052852b44a80ffffffff87242f37f2ee92be2704590726d67e9782be25d07cd936c4b7e2faf446d1ef17000000006a47304402207fef91bc721c42af7fdb8dfc48013e637dbacea07f32d09622355555608d4fd4022054052a3c6e27f142b87df37af0f7095a21853d1285945ea019a15ca79499dba2012103410e33d6a820b054c7daacb80069e213e3ffb47cecfaf101e6a7052852b44a80ffffffff01e8030000000000001976a9149ce02967583d33dd9747385c2062ae03053aec0488ac00000000'
// );

// console.log(newTx.toObject());
