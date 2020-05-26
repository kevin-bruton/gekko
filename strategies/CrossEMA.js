// Let's create our own strategy
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  this.name = 'CrossEMA'
  const shortEmaLength = 10
  const longEmaLength = 21

  this.enableStopLoss = false
  this.priceDiffStopLoss = 47

  this.enableTrailingStop = true
  this.trailingStopDiff = 47


  this.addTalibIndicator('shortEma', 'ema', {optInTimePeriod: shortEmaLength})
  this.addTalibIndicator('longEma', 'ema', {optInTimePeriod: longEmaLength})
  this.addTalibIndicator('rsi', 'rsi', {optInTimePeriod: longEmaLength})
  this.requiredHistory = longEmaLength;
  this.longPosOpen = false
  this.shortPosOpen = false

  /* this.trend = 0
  this.lastDema = 0
  this.lastCandleClose = 0
  this.isPositionOpen = false */
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
  const shortEma = this.talibIndicators.shortEma.result.outReal
  const longEma = this.talibIndicators.longEma.result.outReal
  const rsi = this.talibIndicators.rsi.result.outReal

  if (!shortEma || !longEma) {
    this.advice()
    return
  }
  const previousShortOverLong = this.shortOverLong
  this.shortOverLong = shortEma > longEma
  const cross = previousShortOverLong !== this.shortOverLong
  // console.log('shortEma:', shortEma, 'longEma:', longEma, 'prevShortOverLong:', previousShortOverLong, 'shortOverLong:', this.shortOverLong, 'cross:', cross)

  if (cross) {
    if (this.shortOverLong) {
      if (this.longPosOpen) {
        this.advice('short')
        this.longPosOpen = false
        console.log('CLOSE LONG POSITION. Diff:', (this.longPrice - candle.close).toFixed(0), ((candle.close - this.longPrice)/this.longPrice * 100).toFixed(2), '%')
      }
      this.advice('short')
      this.shortPosOpen = true
      this.shortPrice = candle.close
    } else {
      if (this.shortPosOpen) {
        this.advice('long')
        this.shortPosOpen = false
        console.log('CLOSE SHORT POSITION. Diff:', (candle.close - this.shortPrice).toFixed(0), ((this.shortPrice - candle.close)/this.shortPrice * 100).toFixed(2), '%')
      }
      this.advice('long')
      this.longPosOpen = true
      this.longPrice = candle.close
    }
  } else if (this.enableStopLoss) {
    if (this.longPosOpen && (this.longPrice - candle.close) > this.priceDiffStopLoss) {
      this.advice('short')
      this.longPosOpen = false
      console.log('STOPLOSS ON LONG POSITION. longPrice:', this.longPrice, 'candleClose:', candle.close, 'Diff:', (this.longPrice - candle.close).toFixed(0), ((candle.close - this.longPrice)/this.longPrice * 100).toFixed(2), '%')
    } else if (this.shortPosOpen && (candle.close - this.shortPrice) > this.priceDiffStopLoss) {
      this.advice('long')
      this.shortPosOpen = false
      console.log('STOPLOSS ON SHORT POSITION. shortPrice:', this.shortPrice, 'candleClose:', candle.close, 'Diff:', (candle.close - this.shortPrice).toFixed(0), ((this.shortPrice - candle.close)/this.shortPrice * 100).toFixed(2), '%')
    }
  } else if(this.enableTrailingStop) {
    /* if (candle.close > this.maxPriceObtained) {
      this.maxPriceObtained = candle.close
    } */
    if (this.longPosOpen) {
      //  && (this.maxPriceObtained - candle.close ) > this.trailingStopDiff) {
      const maxPriceObtained = this.maxPriceObtained || candle.close
      if ((maxPriceObtained - candle.close) > this.trailingStopDiff) {
        this.advice('short')
        this.longPosOpen = false
        this.maxPriceObtained = undefined
        console.log('TRAILING STOP ON LONG POSITION. longPrice:', this.longPrice, 'candleClose:', candle.close, 'maxPriceObtained', this.maxPriceObtained, 'Diff:', (this.maxPriceObtained - candle.close).toFixed(0), 'Profit:', ((candle.close - this.longPrice)/this.longPrice * 100).toFixed(2), '%', 'Trailing')
      } else {
        this.maxPriceObtained = (candle.close > maxPriceObtained) ? candle.close : maxPriceObtained
      }
    } else if (this.shortPosOpen) {
      //  && (this.minPriceObtained - candle.close ) > this.trailingStopDiff) {
      const minPriceObtained = this.minPriceObtained || candle.close
      if ((candle.close - minPriceObtained) > this.trailingStopDiff) {
        this.advice('long')
        this.shortPosOpen = false
        this.minPriceObtained = undefined
        console.log('TRAILING STOP ON SHORT POSITION. shortPrice:', this.shortPrice, 'candleClose:', candle.close, 'minPriceObtained', minPriceObtained, 'Diff:', (candle.close - minPriceObtained).toFixed(0), 'Profit:', ((candle.close - this.shortPrice)/this.shortPrice * 100).toFixed(2), '%', 'Trailing')
      } else {
        this.minPriceObtained = (candle.close < minPriceObtained) ? candle.close : minPriceObtained
      }
    }
  }
  /* const trend = dema - this.lastDema
  if (trend > 20 && rsi < 30 && !this.pOpen) {
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
  this.lastDema = dema */
}

// Optional for executing code
// after completion of a backtest.
// This block will not execute in
// live use as a live gekko is
// never ending.
strat.end = function() {
}

module.exports = strat;
