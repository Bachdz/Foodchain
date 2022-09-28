const {Blockchain, Data, Block} = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey= ec.keyFromPrivate('838650de604618639af41311041b9d33a23c4898a14dbfc5b96a3f837f4ac350');
const myAddress = myKey.getPublic('hex');


let foodChain = new Blockchain();

const data1 = new Data(myAddress, 'public key goes here', 10)
data1.signData(myKey)
foodChain.addBlock(new Block(Date.now(), data1, ''))







// foodChain.addBlock(new Block(Date.now(), "26.09.2022", {harvest : "at Farmer"}));
// foodChain.addBlock(new Block(Date.now(),"27.09.2022", {transfer: "to Walmart"}));

console.log(JSON.stringify(foodChain,null, 4));

console.log()
foodChain.chain[1].data.amount = 1;
console.log("is chain valid? ", foodChain.isValid())