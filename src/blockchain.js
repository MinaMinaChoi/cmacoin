const CryptoJS = require("crypto-js");

class Block {
  constructor(index, hash, previousHash, timestamp, data) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

const genesisBlock = new Block(
  0,
  "BE8C0CB6A9F5AF6ABE0F76B5A400703EA931D06A90E47D32EB01F2695E9F50D6",
  null,
  1522555134417,
  "This is the genesis!!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockChain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) =>
  CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();

const createNewBlock = data => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const newHash = createHash(
    newBlockIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );

  const newBlock = new Block(
      newBlockIndex,
      newHash,
      previousBlock.hash,
      newTimestamp,
      data
  )
  addBlockToChain(newBlock);
  return newBlock;
};

const getBlocksHash = (block) => createHash(block.index, block.previousHash, block.timestamp, block.data);

const isNewBlockValid = (candidateBlock, latestBlock) => {
    if(!isNewStructrueValid(candidateBlock)) {
        console.log('후보블록 구조 invalid');
        return false;
    } else if(latestBlock.index + 1 !== candidateBlock.index) {
        console.log("The candidate block doesnt have a valid index");
        return false;
    } else if (latestBlock.hash !== candidateBlock.previousHash) {
        console.log('The previousHash is not the hash of the latest block')
        return false;
    } else if (getBlocksHash(candidateBlock) !== candidateBlock.hash) {
        console.log('이 블록의 해시 invalid');
        return false;
    }
    return true;
};

const isNewStructrueValid = (block) => {
    return (
        typeof block.index === 'number' && 
        typeof block.hash === 'string' &&
        typeof block.previousHash === 'string' && 
        typeof block.timestamp === 'number' &&
        typeof block.data === 'string'
    )
}

// 새로운 블록체인이 오면 그 체인이 유효한지 확인필요!
// 유요한가? 더 긴가? 
// 유효하고 더 긴 블록체인을 이용하도록!
const isChainValid = (candidateChain) => {
    const isGenesisValid = block => {
        return JSON.stringify(block) == JSON.stringify(genesisBlock);
    }

    if(!isGenesisValid(candidateChain[0])) {
        console.log("The candidate chain's genesisblock is not the same as our genesisBlock")
        return false;
    }
    for( let i = 1; i < candidateChain.length; i++) {
        if(!isNewBlockValid(candidateChain[i], candidateChain[i -1])) {
            return false;
        }
    }
    return true;
};


const replaceChain = newChain => {
    if(isChainValid(newChain) && newChain.length > getBlockChain().length) {
        blockchain = newChain;
        return true;
    } else {
        return false;
    }
};

const addBlockToChain = candidateBlock => {
    if(isNewBlockValid(candidateBlock, getLastBlock())) {
        getBlockChain().push(candidateBlock);
        return true;
    } else {
        return false;
    }
};

module.exports = {
    getBlockChain,
    createNewBlock,

}