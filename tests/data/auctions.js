const BigNumber = require('bignumber.js')

const pricesInUSD = [{
  token: 'RDN',
  price: 4.115 // $/RDN
}, {
  token: 'ETH',
  price: 1001.962 // $/ETH
}, {
  token: 'OMG',
  price: 13.957 // $/OMG
}]

const balances = {
  'RDN': {
    '0x424a46612794dbb8000194937834250Dc723fFa5': 517.345, // Anxo
    '0x8c3fab73727E370C1f319Bc7fE5E25fD9BEa991e': 30.20,   // Pepe
    '0x627306090abaB3A6e1400e9345bC60c78a8BEf57': 1000.0,  // Ganache
    '0xAe6eCb2A4CdB1231B594cb66C2dA9277551f9ea7': 601.112  // Dani
  },
  'ETH': {
    '0x424a46612794dbb8000194937834250Dc723fFa5': 3.44716, // Anxo
    '0x8c3fab73727E370C1f319Bc7fE5E25fD9BEa991e': 2.23154, // Pepe
    '0x627306090abaB3A6e1400e9345bC60c78a8BEf57': 3.88130, // Ganache
    '0xAe6eCb2A4CdB1231B594cb66C2dA9277551f9ea7': 4.01234  // Dani
  },
  'OMG': {
    '0x424a46612794dbb8000194937834250Dc723fFa5': 267.345, // Anxo
    '0x8c3fab73727E370C1f319Bc7fE5E25fD9BEa991e': 15.20,   // Pepe
    '0x627306090abaB3A6e1400e9345bC60c78a8BEf57': 500.0,   // Ganache
    '0xAe6eCb2A4CdB1231B594cb66C2dA9277551f9ea7': 301.112  // Dani
  }
}

const auctions = {
  'RDN-ETH': {
    // Aprox 0.004079 ETH/RDN
    index: 77,
    auctionStart: new Date(),
    // https://walletinvestor.com/converter/usd/raiden-network-token/315
    sellVolume: new BigNumber('76.5478441e18'),      // RDN. aprox $315
    sellVolumeNext: new BigNumber('12.5478441e18'),  // RDN
    buyVolume: new BigNumber('0e18')                 // ETH
  },
  'ETH-RDN': {
    index: 77,
    auctionStart: new Date(),
    // https://walletinvestor.com/converter/usd/ethereum/290
    sellVolume: new BigNumber('0.2894321e18'),       // ETH. aprox $290
    sellVolumeNext: new BigNumber('12.5478441e18'),  // ETH
    buyVolume: new BigNumber('0e18')                 // RDN
  },
  'OMG-ETH': {
    // Aprox 0.022220 ETH/OMG
    index: 3,
    auctionStart: null,
    // https://walletinvestor.com/converter/usd/omisego/315
    sellVolume: new BigNumber('22.569633e18'),      // OMG. aprox $315
    sellVolumeNext: new BigNumber('12.547844e18'),  // OMG
    buyVolume: new BigNumber('0e18')                // ETH
  },
  'ETH-OMG': {
    index: 3,
    auctionStart: null,
    // https://walletinvestor.com/converter/usd/ethereum/550
    sellVolume: new BigNumber('1.381729e18'),       // ETH. aprox $1384
    sellVolumeNext: new BigNumber('10.547844e18'),  // ETH
    buyVolume: new BigNumber('0e18')                // OMG
  }
}

module.exports = {
  pricesInUSD,
  balances,
  auctions
}
