<template lang='pug'>
.grd-row-col-3-6
  table.p1
    tr
      th amount of trades
      td {{ report.trades }}
    tr
      th sharpe ratio
      td {{ round2(report.sharpe) }}
    tr
      th start balance
      td {{ round(report.startBalance) }} {{ report.currency }}
    tr
      th final balance
      td {{ round(report.balance) }} {{ report.currency }}
    tr
      th alpha
      td.price(:class='alphaClass') {{ (report.relativeProfit - market).toFixed(2) }}%
    tr
      th simulated profit

  .big.txt--right.price(:class='profitClass') {{ report.relativeProfit.toFixed(2) }}%

</template>

<script>

export default {
  props: ['report', 'market'],
  mounted: function() {
    console.log('report:', this.report);
  },
  methods: {
    round2: n => (+n).toFixed(2),
    round: n => (+n).toFixed(5)
  },
  computed: {
    profitClass: function() {
      return (this.report.relativeProfit > 0) ? 'profit' : 'loss'
    },
    alphaClass: function() {
      return (this.report.relativeProfit - this.market) > 0 ? 'profit' : 'loss'
    }
  }
}
</script>

<style>
.summary td {
  text-align: right;
}

.big {
  font-size: 1.3em;
  width: 80%;
}

.summary table {
  width: 80%;
}

.price.profit {
  color: rgb(65, 156, 13);
}

.price.loss {
  color: red;
}

</style>
