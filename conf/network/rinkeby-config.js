const env = process.env.NODE_ENV
let DX_CONTRACT_ADDRESS, RDN_TOKEN_ADDRESS, OMG_TOKEN_ADDRESS

// In Rinkeby we use different instances of the contract for dev and staging
if (env === 'pre') {
  // staging
  DX_CONTRACT_ADDRESS = '0x16be0a7aff00a35f43ca467b6fbbb2d511118553'
  RDN_TOKEN_ADDRESS = '0xd7da78985fbf633bae69eb01e2ca7187304920c1'
  OMG_TOKEN_ADDRESS = '0x46965eb364b661609c9b3b9625527040618eb0e1'
} else {
  DX_CONTRACT_ADDRESS = null
  if (env !== 'pro') {
    // dev, local, test
    RDN_TOKEN_ADDRESS = '0xde6efd396e18a950b45e24d6225505f48d0c627b'
    OMG_TOKEN_ADDRESS = '0x8bdd53a53c53fbc40d38231d6219f8cb7b59a704'
  } else {
    // pro
    RDN_TOKEN_ADDRESS = null
    OMG_TOKEN_ADDRESS = null
  }
}

module.exports = {
  NETWORK: 'rinkeby', // 4
  ETHEREUM_RPC_URL: 'https://rinkeby.infura.io',

  // Tokens
  DX_CONTRACT_ADDRESS,
  RDN_TOKEN_ADDRESS,
  OMG_TOKEN_ADDRESS
}
