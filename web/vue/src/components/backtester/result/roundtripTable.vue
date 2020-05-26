<template lang='pug'>
  .contain.roundtrips
    h2 Roundtrips
    table(v-if='roundtrips.length')
      thead
        tr
          th Entry at (UTC)
          th Exit at (UTC)
          th Exposure
          th Entry balance
          th Exit balance
          th P&amp;L
          th Profit
        tr(v-for='rt in roundtrips')
          td {{ fmt(rt.entryAt) }}
          td {{ fmt(rt.exitAt) }}
          td {{ diff(rt.duration) }}
          td {{ round(rt.entryBalance) }}
          td {{ round(rt.exitBalance) }}
          template(v-if="Math.sign(rt.pnl)===-1")
            td.loss {{ rt.pnl.toFixed(2) }}
            td.loss {{ rt.profit.toFixed(2) }}%
          template(v-else)
            td.profit {{ rt.pnl.toFixed(2) }}
            td.profit {{ rt.profit.toFixed(2) }}%
        tr
          td
          td
          td
          td
          td Totals:
          td(:class='profitClass') {{ totalProfit }}
          td(:class='profitClass') {{ (totalProfit / roundtrips[0].entryBalance * 100).toFixed(2) }}%
    div(v-if='!roundtrips.length')
      p Not enough data to display
</template>

<script>
import _ from 'lodash'

export default {
  props: ['roundtrips'],
  data: () => {
    return {
      totalProfit: 0
    }
  },
  mounted: function () {
    this.totalProfit = this.roundtrips && (this.roundtrips[this.roundtrips.length - 1].exitBalance - this.roundtrips[0].entryBalance).toFixed(2)
    console.log('totalProfit', this.totalProfit)
  },
  computed: {
    profitClass: function() {
      return (this.totalProfit >= 0) ? 'profit' : 'loss'
    }
  },
  methods: {
    diff: n => moment.duration(n).humanize(),
    humanizeDuration: (n) => window.humanizeDuration(n),
    fmt: date => {

      // roundtrips coming out of a backtest
      // are unix timestamp, live roundtrips
      // are date strings.
      // TODO: normalize

      let mom;

      if(_.isNumber(date)) {
        mom = moment.unix(date);
      } else {
        mom = moment(date).utc();
      }

      return mom.utc().format('YYYY-MM-DD HH:mm');
    },
    round: n => (+n).toFixed(3),
    total: (arr, prop) => arr.reduce((acc, cur) => acc + cur[prop], 0)
  },
}
</script>

<style>

.roundtrips {
  margin-top: 50px;
  margin-bottom: 50px;
}

.roundtrips table {
  width: 100%;
}

.roundtrips table th,
.roundtrips table td {
  border: 1px solid #c6cbd1;
  padding: 8px 12px;
}

.roundtrips table td.loss {
  color: red;
  text-align: right;
}
.roundtrips table td.profit {
  color: green;
  text-align: right;
}

.roundtrips table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

</style>
