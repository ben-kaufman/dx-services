const debug = require('debug')('dx-service:helpers:ContractLoader')
const environment = process.env.NODE_ENV
const isLocal = environment === 'local'

class ContractLoader {
  constructor ({
    ethereumClient,
    contractDefinitions,
    dxContractAddress = null,
    gnoTokenAddress = null,
    erc20TokenAddresses = {},
    devContractsBaseDir
  }) {
    this._ethereumClient = ethereumClient
    this._contractDefinitions = contractDefinitions
    this._dxContractAddress = dxContractAddress
    this._gnoTokenAddress = gnoTokenAddress
    this._erc20TokenAddresses = erc20TokenAddresses
    this._devContractsBaseDir = devContractsBaseDir
  }
  async loadContracts () {
    const [ dx, erc20TokenContracts ] = await Promise.all([
      this._loadDx(),
      this._loadTokenContracts()
    ])
  
    const dxContracts = await this._loadDxContracts(dx)
  
    return { dx, ...dxContracts, erc20TokenContracts }
  }
  
  async _loadDx () {
    const dxContract = this._ethereumClient
      .loadContract(this._contractDefinitions.DutchExchange)
  
    let dxContractAddress
    if (this._dxContractAddress) {
      dxContractAddress = this._dxContractAddress
      this._dxMaster = null // no public :(
    } else if (isLocal) {
      // For local, we get the address from the contract definition
      const proxyContract = this._ethereumClient
        .loadContract(this._contractDefinitions.DutchExchangeProxy)
  
      const dxProxy = await proxyContract.deployed()
      dxContractAddress = dxProxy.address
  
      this._dxMaster = await dxContract.deployed()
    } else {
      throw new Error('The DX address is mandatory for the environment ' + environment)
    }
    const dxContractInstance = dxContract.at(dxContractAddress)
  
    // no public :(
    // this._dxMaster = dxContractInstance.masterCopy
  
    return dxContractInstance
  }
  
  async _loadERC20tokenContract (token, tokenContract) {
    let address = this._erc20TokenAddresses[token]
    if (!address) {
      if (isLocal) {
        address = await this._ethereumClient
          .loadContract(`${this._devContractsBaseDir}/Token${token}`)
          .deployed()
          .then(contract => contract.address)
      } else {
        throw new Error(`The Token address for ${token} is mandatory for the environment ${environment}`)
      }
    }
    return {
      token,
      contract: tokenContract.at(address)
    }
  }
  
  async _loadGnoContract () {
    const gnoTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.TokenGNO)
  
    // GNO can be pulled from the OWLAirdrop (the minter of the OWLToken)
    // For now, we jsut assume we get the address in the config file
    let address = this._gnoTokenAddress
    if (!address) {
      if (isLocal) {
        address = await gnoTokenContract
          .deployed()
          .then(contract => contract.address)
      } else {
        throw new Error(`The Token address for GNO is mandatory for the environment ${environment}`)
      }
    }
  
    return gnoTokenContract.at(address)
  }
  
  async _loadTokenContracts () {
    const standardTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.StandardToken)
  
    debug('this._erc20TokenAddresses: ', this._erc20TokenAddresses)
  
    const tokenContractList = await Promise.all(
      Object
        .keys(this._erc20TokenAddresses)
        .map(token => {
          return this._loadERC20tokenContract(token, standardTokenContract)
        })
    )
  
    return tokenContractList.reduce((tokenContractsAux, contractInfo) => {
      tokenContractsAux[contractInfo.token] = contractInfo.contract
      return tokenContractsAux
    }, {})
  }
  
  async _loadDxContracts (dx) {
    const etherTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.EtherToken)
  
    const tulTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.TokenTUL)
  
    /* TODO: Get GNO from OWL address? ? */
    const owlTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.TokenOWL)
  
    /*
    const gnoTokenContract = this._ethereumClient
      .loadContract(this._contractDefinitions.TokenGNO)
    */
  
    const priceOracleContract = this._ethereumClient
      .loadContract(this._contractDefinitions.PriceOracleInterface)
  
    const [ priceOracle, eth, tul, owl, gno ] = await Promise.all([
      // load addresses from DX
      dx.ETHUSDOracle.call(),
      dx.ETH.call(),
      dx.TUL.call(),
      dx.OWL.call() // TODO: Is this the PROXY??
    ])
      // load instances of the contract
      .then(([ priceOracleAddress, ethAddress, tulAddress, owlAddress ]) => (
        Promise.all([
          priceOracleContract.at(priceOracleAddress),
          etherTokenContract.at(ethAddress),
          tulTokenContract.at(tulAddress),
          owlTokenContract.at(owlAddress),
          this._loadGnoContract()
        ]))
      )
    return {
      priceOracle,
      eth,
      tul,
      owl,
      gno
    }
  }  
}
module.exports = ContractLoader