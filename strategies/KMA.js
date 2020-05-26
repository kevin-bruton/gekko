// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  this.name = 'KMA'
  const optInTimePeriod = 5
  this.addTulipIndicator('dema', 'dema', {optInTimePeriod})
  this.addTulipIndicator('rsi', 'rsi', {optInTimePeriod})
  this.requiredHistory = optInTimePeriod;
  this.trend = 0
  this.lastDema = 0
  this.lastCandleClose = 0
  this.isPositionOpen = false
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
  //console.log('***** indicators:', this.tulipIndicators)
  const dema = this.tulipIndicators.dema.result.result
  const rsi = this.tulipIndicators.rsi.result.result
  const trend = dema - this.lastDema
  if (trend > 20 /* && rsi < 30 */ && !this.pOpen) {
    this.advice('long')
    console.log('***** BUY ***** Open:', this.isPositionOpen)
    this.isPositionOpen = true
  } else if (trend < 0 && this.isPositionOpen) {
    this.advice('short')
    console.log('***** SELL ***** Open:', this.isPositionOpen)
    this.isPositionOpen = false
  } else {
    this.advice()
  }
  console.log('***** dema:', dema && dema.toFixed(0), 'rsi:', rsi && rsi.toFixed(0), 'trend:', trend && trend.toFixed(0), 'Open', this.isPositionOpen)
  // console.log(candle)
  this.lastDema = dema
}

// Optional for executing code
// after completion of a backtest.
// This block will not execute in
// live use as a live gekko is
// never ending.
strat.end = function() {
}

module.exports = strat;
