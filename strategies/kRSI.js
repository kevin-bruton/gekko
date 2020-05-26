// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  this.name = 'kRSI'
  this.config = {
    interval: 14,
    buyAtRsi: 30,
    takeProfitPercentage: 2,
    enableStopLoss: true,
    stopLossPercentage: 50
  }

  this.addTalibIndicator('rsi', 'rsi', {optInTimePeriod: this.config.interval})
  this.longPosOpen = false
  this.shortPosOpen = false
  this.previousRsi = 50
}

// What happens on every new candle?
strat.update = function(candle) {
  // your code!
}

// For debugging purposes.
strat.log = function() {
  // this.log.debug()
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {
  const rsi = this.talibIndicators.rsi.result.outReal
  const profit = this.profitPercentage(candle.close, this.boughtPrice)
// console.log(`posNotOpen: ${!this.longPosOpen}; rsi<30: ${rsi < 30}; prevRsi not rsi: ${this.previousRsi !== rsi}; prevRsi: ${this.previousRsi}; rsi: ${rsi}`)
  if (rsi < this.config.buyAtRsi && this.previousRsi !== rsi && !this.longPosOpen) {
    this.advice('long')
    this.longPosOpen = true
    this.boughtRsi = rsi
    this.boughtPrice = candle.close
  }
  if (this.longPosOpen && profit > this.config.takeProfitPercentage && this.previousRsi !== rsi) {
    this.advice('short')
    this.longPosOpen = false
    console.log(`rsi: ${this.boughtRsi}; ${rsi}; price: ${this.boughtPrice}; ${candle.close}; profit: ${profit}%`)
  }
  /* if (rsi > this.sellRsi && this.longPosOpen) {
    this.advice('short')
    this.longPosOpen = false
    console.log(`rsi: ${this.boughtRsi}; ${rsi}; price: ${this.boughtPrice}; ${candle.close}; profit: ${((candle.close - this.boughtPrice) / this.boughtPrice * 100).toFixed(2)}%`)
  } */
  // Stop loss
  if (this.config.enableStopLoss) {
    /* if (this.longPosOpen && loosing) {
      console.log('Profit Percentage:', currentProfitPercentage)
    } */
    if (this.longPosOpen && profit < -this.config.stopLossPercentage) {
      this.advice('short')
      this.longPosOpen = false
      console.log(`STOP LOSS rsi: ${this.boughtRsi}; ${rsi}; price: ${this.boughtPrice}; ${candle.close}; profit: ${profit}%`)
    }
  }
  this.previousRsi = rsi
  this.latestPrice = candle.close
}

// Optional for executing code
// after completion of a backtest.
// This block will not execute in
// live use as a live gekko is
// never ending.
strat.end = function(candle) {
  if (this.longPosOpen) {
    const profit = this.profitPercentage(this.lastPrice, this.boughtPrice)
    this.advice('short')
    this.longPosOpen = false
    console.log(`CLOSING OPEN POSITION price: ${this.boughtPrice}; ${this.lastPrice}; profit: ${profit}%`)
  }
}

strat.profitPercentage = function(currentPrice, boughtPrice) {
  return Number(((currentPrice - boughtPrice) / boughtPrice * 100).toFixed(2))
}

module.exports = strat;
