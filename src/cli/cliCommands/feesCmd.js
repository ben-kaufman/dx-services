const cliUtils = require('../helpers/cliUtils')
const formatUtil = require('../../helpers/formatUtil')
const getDateRangeFromParams = require('../../helpers/getDateRangeFromParams')

function registerCommand ({ cli, instances, logger }) {
  cli.command(
    'fees [--account account] [--from-date fromDate --to-date toDate] [--period period]',
    'Get the fees applied on the trades',
    yargs => {
      cliUtils.addOptionByName({ name: 'from-date', yargs })
      cliUtils.addOptionByName({ name: 'to-date', yargs })
      cliUtils.addOptionByName({ name: 'period', yargs })
      cliUtils.addPositionalByName('account', yargs)
    }, async function (argv) {
      const {
        fromDate: fromDateStr,
        toDate: toDateStr,
        period,
        account
      } = argv

      const { fromDate, toDate } = getDateRangeFromParams({
        period, fromDateStr, toDateStr
      })

      const {
        dxInfoService
      } = instances

      logger.info('Find %s between %s and %s',
        account ? 'all the fees for ' + account : 'all fees',
        formatUtil.formatDateTime(fromDate),
        formatUtil.formatDateTime(toDate)
      )

      dxInfoService.getFees({ account })

      // Get fees
      const fees = await dxInfoService.getFees({
        fromDate, toDate, account
      })

      if (fees.length > 0) {
        // console.log(JSON.stringify(fees, null, 2))
        fees.forEach(({ tradeDate, sellToken, buyToken, user, auctionIndex, fee, transactionHash }) => {
          logger.info(
            '[%s] %s-%s-%d (%s): %d %s. Tx: %s',
            formatUtil.formatDateTime(tradeDate),
            sellToken.symbol,
            buyToken.symbol,
            auctionIndex,
            user,
            fee,
            sellToken.symbol,
            transactionHash
          )
        })
      } else {
        logger.info('No fees match the criteria.')
      }
    })
}

module.exports = registerCommand
