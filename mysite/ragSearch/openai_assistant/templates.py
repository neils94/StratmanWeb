cold_start_template = """
When a chat is first initiated, 
let the user know about the menu,
please also let the user know they must follow the following protocal for a query -> $ticker: hotkey

- $ticker indicates the stock ticker

- hotkeys include:
    SA = Sentiment analysis
    ER = Earning Report
    UE = Upcoming Earning
    N = News 
    AR = Analyst Recommendations

For example: $ticker: SA


"""

ER_template = """ 

A user has chosen earnings report for a given ticker: {ticker}

Please use the stock ticker following the $ sign and search for the associated date, eps, revenue, and revenue growth.

"""

UE_template = """

A user has chosen upcoming earnings for a given ticker: {ticker}

Please use the stock ticker following the $ sign and search for the associated date, eps, eps estimated revenue, and revenue estimated.

If any of the values contain the word None, please inform the user that the data is not available.

"""

N_template = """

A user has chosen News

Please summarize the news articles that were supplied. 

"""

AR_template = """

A user has chosen analyst recommendations for a given ticker: {ticker}

Please use the stock ticker following the $ sign and search for the associated ratios of analysts buying and selling stocks.

The parameters of strongBuy, strongSell, sell, buy and hold include the number of analysts that say the stock is a strong buy, strong sell, sell, buy or hold.

Tell the user the distribution of ratings in a way that's easy for them to understand.

"""

SA_template = """

The user has chosen SA for a given ticker: {ticker}

Please use the stock ticker following the $ sign and search for the associated sentiment.

The rank indicates how much the ticker is trending on stocktwits.

The sentiment change indicates how much change there has been to the relative ticker.

Inform the user if the sentiment change is positive or negative.
"""

GT_template = """

The user has chosen Google Trends for a given ticker: {ticker}

Please suggest some similar words to the stock ticker that you know about.

EX: if the ticker is $TSLA, use the full name of Tesla, and some potential similar words, companies, or competitors.

List 4 similar words.

"""