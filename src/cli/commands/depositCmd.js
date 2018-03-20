function registerCommand ({ cli, instances, logger }) {
  cli.command(
    'deposit <amount> <token>',
    'Deposit the DX account depositing tokens into it',
    yargs => {
      yargs.positional('amount', {
        type: 'float',
        describe: 'Amount to buy'
      })
      yargs.positional('token', {
        type: 'string',
        default: 'ETH',
        describe: 'Name of the token'
      })
    }, async function (argv) {
      const { amount, token } = argv
      const {
        botAccount,
        dxTradeService
      } = instances

      logger.info(`Deposit %d %s into the DX for %s`,
        amount,
        token,
        botAccount
      )
      const depositResult = await dxTradeService.deposit({
        token,
        amount: amount * 1e18,
        accountAddress: botAccount
      })
      logger.info('The delivery was succesful. Transaction: %s', depositResult.tx)
    })
}

module.exports = registerCommand
