<h1>
<img src="https://github.com/vivek32ta/posizer/blob/master/assets/48.png?raw=true"> posizer</h1>

A chrome extension to position size your trades and estimate the brokerage and taxes with those positions on the go.

## content
- [Features](#features-you-might-like)
- [The What](#why-position-size-even?)
- [The Why](#what-do-the-words-mean?)
- [The How](#how-does-it-work?)
- [The Motive](#the-underlying-motive-to-build)
- [Build](#develop)

## features you might like
- Set allocated capital and risk percentage based on your preference. 
	(You can only to type it once per browser session, instead of during every trade.)
- Estimate tax, brokerage and charges on the position based on the usual discount broker and NSE charges.
- Open this on a particular stock chart in Zerodha to automatically consider the opened ticker price for entry. (Open after the market depth is loaded)


## why position size even?

> To think is easy. To act is hard. 
But the hardest thing in the world is to act in accordance with your thinking.

As a trader, you need to find out your tolerance for risk. There are two opposite sides in the trading spectrum with one extreme being risk-seeking and the other being risk-averse.

Do you know where you stand?

Although most traders risk a fixed percentage of their account on a trade, there’s no one-size-fits-all method to go about it. Before you get all mathematical, you first need to determine your psychological limits for risk. If you’re unsure how to go about it, take it slow.

Adjust your position sizes according to the potential losses that you know you can sustain.

The basic rule is to keep them small enough so that even when you lose, they don’t evoke any strong emotional response that could derail your trading.

Traders often make the mistake of focusing solely on finding the perfect entries and exits.

But what really spells the difference between successful and unsuccessful traders is risk management. It’s something that should never be taken for granted. And the first step towards smart risk management is proper position sizing.


## what do the words mean?

- **Entry** : Price at which your order to buy/sell is executed.
- **Stop Loss** : Price at which to close a losing position to prevent further losses.
- **Active Capital** : Allocated account balance.
- **Risk Percentage**: The percent of active capital that you're willing to risk.
- **Position Size** : Number of contracts/units of an instrument you buy or sell.
- **Position Value**: Capital you'll be spending to enter the particular position.
- **Capital at Risk** : Capital you lose on the trade if your stop loss gets. triggered.
- **Tax & Charges** : Brokerage, STT Charges, Stamp Charges, Taxes etc...

	Note: Position size and capital at risk are NOT the same. This is important to understand or else nothing will make sense.

## how does it work?
#### whole process

To make things easier for you to understand, let's consider Newbie Kevin.

A long time ago, back when he was even more of a newbie than he is now, he blew out his account because he put on some enormous positions.

It was as if he was a gun-slinging cowboy from the Midwest – he traded from the hip and traded BIG. Kevin didn’t fully understand the importance of position sizing and his account paid dearly for it.

Newbie Kevin just deposited ₹5,000 into his trading account and he is ready to start trading again. Let’s say he now uses a swing trading system that trades Reliance and that he risks about 10 points per trade i.e., enters at ₹1890 and sets the stop loss at ₹1880.

Ever since he blew out his first account, he has now sworn that he doesn’t want to risk more than 1% of his account per trade.

Let’s figure how big his position size needs to be to stay within his risk comfort zone.

Using his account balance and the percentage amount he wants to risk, we can calculate the amount risked.

₹ 5,000 x 1% (or 0.01) = ₹ 50

Next, we divide the amount risked by the points he is willing to risk to get the quantity that he needs to trade.

(₹ 50)/(10 points) = 5 units

So, Newbie Kevin should trade on 5 units of Reliance or less to stay within his risk comfort level with his current trade setup. Otherwise, he’d be regressing back to his previous gambling self.

Pretty simple eh?

#### brokerage, charges & taxes 
All the below charges have been considered and added to give the total charges, you also have the option to exclude them in your calculation.

- **Securities Transaction Tax** : Tax by the government when transacting on the exchanges. Charged as above on both buy and sell sides when trading equity delivery. Charged only on the selling side when trading intraday or on F&O.
- **Transaction/Turnover Charges** : Exchange transaction charges + Clearing charges. Charged by exchanges (NSE,BSE,MCX) and clearing member.
- **Stamp Charges** : Stamp charges by the Government of India as per the Indian Stamp Act of 1899 for transacting in instruments on the stock exchanges and depositories.
- **GST** : Tax levied by the government on the services rendered. 18% of ( brokerage + transaction charges)
- **SEBI Charges** : Charged at ₹5 per crore by Securities and Exchange Board of India for regulating the markets.
- **Brokerage** : Assumed to be 0 for Equity(Delivery), 0.03% or Rs. 20/executed order whichever is lower for Equity(Intraday) and Futures, and Flat Rs. 20 per executed order for Options.

## the underlying motive to build
I had been struggling with my personal trading consistency and I built this to hold myself at a much more accurate and better risk management standard on every single trade that I take.
> And I haven't blown my entire account since. So I see this as an absolute win lol.

## develop
- Clone into the repository
	```
	git clone https://github.com/vivek32ta/posizer.git
	cd posizer
	```
- Open `chrome://extensions`.
- Enable Developer mode and click on Load Unpacked Extension.
- Navigate and select the repository folder.
- Pin the extension on the URL bar to keep it handy.

## p.s
If you come across a bug or if you have an idea for a new feature, feel free to reach out to me. Or even if you wanna talk about just anything, do reach out.
