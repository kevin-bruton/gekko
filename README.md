Gekko is a Digital Currency TA trading and backtesting platform that connects to popular Bitcoin exchanges. It is written in JavaScript and runs on [Node.js](http://nodejs.org).

## Installation & Usage

See [the installing Gekko doc](https://gekko.wizb.it/docs/installation/installing_gekko.html).

## Community & Support

Gekko has [a forum](https://forum.gekko.wizb.it/) that is the place for discussions on using Gekko, automated trading and exchanges. In case you rather want to chat in realtime about Gekko feel free to join the [Gekko Support Discord](https://discord.gg/26wMygt).

## Roadmap based on current limitations found in Gekko2

1. The buy and sell positions are always buying and selling the whole lot (no way of specifying a lot size for trading).
This makes it imposible to open several positions at the same time.
-> Enable possibility of setting lot size

2. When using indicators and analysing a strategy on when it opens and closes positions, it is useful to be able to see the indicator drawn on the results chart. At the moment only the price is being plotted and when a position is open or closed.
-> Add indicator data to report data returned by the backtest endpoint and add this to result D3 chart
