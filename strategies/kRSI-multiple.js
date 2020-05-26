// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  this.name = 'kRSI'
  this.config = {
    interval: 14,
    buyAtRsi: 30,
    maxNumPositionsOpen: 5,
    takeProfitPercentage: 2,
    enableStopLoss: false,
    stopLossPercentage: 50
  }

  this.addTalibIndicator('rsi', 'rsi', {optInTimePeriod: this.config.interval})
  this.longPosOpen = false
  this.shortPosOpen = false

  this.previousRsi = 50
  this.bought = []
}

// What happens on every new candle?
strat.update = function(candle) {
  // your code!
}

// For debugging purposes.
strat.log = function() {
  // this.log.debug()
}

strat.profitPercentage = function(currentPrice, boughtPrice) {
  return Number(((currentPrice - boughtPrice) / boughtPrice * 100).toFixed(2))
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {
  const rsi = Math.round(this.talibIndicators.rsi.result.outReal)
  const loosing = this.profitPercentage(candle.close) < 0
  const currentProfitPercentage = this.profitPercentage(candle.close)
// console.log(`posNotOpen: ${!this.longPosOpen}; rsi<30: ${rsi < 30}; prevRsi not rsi: ${this.previousRsi !== rsi}; prevRsi: ${this.previousRsi}; rsi: ${rsi}`)

  // BUY
 /*  if ((rsi < (this.config.buyAtRsi - (this.bought.length))) && (this.previousRsi !== rsi) && (this.bought.length <= this.config.maxNumPositionsOpen)) {
    this.advice('long')
    this.bought.push({rsi, price: candle.close})
    console.log('BUY')
  } */

  // BUY
  if (this.bought.length < this.config.maxNumPositionsOpen) {
    if (rsi < (this.config.buyAtRsi - this.bought.length)) {
      this.advice('long')
      this.bought.push({rsi, price: candle.close})
      console.log('BUY. Num positions:', this.bought.length)
    }
  }

  // SELL
  for(let i = 0; i< this.bought.length; i++) {
    const pos = this.bought[i]
    const profit = this.profitPercentage(candle.close, pos.price)
    if (profit > this.config.takeProfitPercentage) {
      this.advice('short')
      this.bought.splice(i, 1)
      console.log(`rsi: ${pos.rsi}; ${rsi}; price: ${pos.price}; ${candle.close}; profit: ${((candle.close - pos.price) / pos.price * 100).toFixed(2)}%`)
    }
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
    if (this.longPosOpen && loosing && currentProfitPercentage < -this.config.stopLossPercentage) {
      this.advice('short')
      this.numPositionsOpen--
      console.log(`STOP LOSS rsi: ${this.boughtRsi}; ${rsi}; price: ${this.boughtPrice}; ${candle.close}; profit: ${currentProfitPercentage}%`)
    }
  }
  this.previousRsi = rsi
  this.lastPrice = candle.close
}

// Optional for executing code
// after completion of a backtest.
// This block will not execute in
// live use as a live gekko is
// never ending.
strat.end = function() {
  for(let i = 0; i < this.bought.length; i++) {
    this.advice('short')
    console.log(`CLOSING OPEN POSITION price: ${this.bought[i].price}; ${this.lastPrice}; profit: ${this.profitPercentage(this.lastPrice, this.bought[i].price)}%`)
  }
}

module.exports = strat;
