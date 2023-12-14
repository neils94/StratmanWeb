import requests
import datetime
import pytrends

today = datetime.date.today()
one_day_from_today = today + datetime.timedelta(days=90)
"""
    Retrieves the earnings calendar from the Financial Modeling Prep API.

    Returns:
        A `Response` object containing the HTTP response from the API.
"""

def get_earnings_calendar():
    url = f'https://financialmodelingprep.com/api/v3/earning_calendar?from={today}&to={one_day_from_today}&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V'
    earnings_calendar = requests.get(url)
    return earnings_calendar

def get_symbol_based_sentiment(symbols):
    for i in symbols:
        symbol = symbols[i]
        url = f'https://financialmodelingprep.com/api/v4/historical/social-sentiment?symbol={symbol}&page=0&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V'
        sentiment = requests.get(url).json()
        
    return sentiment

def get_social_sentiment_change():
    url = "https://financialmodelingprep.com/api/v4/social-sentiments/change?type=bullish&source=stocktwits&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V"
    sentiment = requests.get(url).json()
    return sentiment

def get_google_trends(ticker_kw_list):
    payload = pytrends.build_payload(kw_list=ticker_kw_list, timeframe='today 1-y', geo='', gprop='')
    
    pass

eps = []
epsEstimate = []

earnings_calendar  = get_earnings_calendar()
symbols = []

"""
for i in earnings_calendar.json():
    for k,v in i.items():
        if k == 'symbol':
            if "." in v:
                pass
            else:
                #set them to a txt document from json
                None
print(len(symbols))

"""

print(earnings_calendar.json())


    #earnings periods
#Q1 4-15 - 5-31 Q2 7-15 - 8-31 Q3 10-15 - 11-30 Q4 1-15 - 2-28