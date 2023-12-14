import requests
import datetime

today = datetime.date.today()
one_earnings_cycle = today + datetime.timedelta(days=30)
prev_earnings_cycle = today - datetime.timedelta(days=30)
ticker = "AAPL"

url = f"https://financialmodelingprep.com/api/v3/earning_calendar?from={today}&to={one_earnings_cycle}&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V"

url2 = f"https://financialmodelingprep.com/api/v3/income-statement/{ticker}?period=annual&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V"
getter = requests.get(url2)
getter_dict = getter.json()

hotkey_dict = {'SA':"https://financialmodelingprep.com/api/v4/social-sentiments/change?type=bullish&source=stocktwits", 
               'ER': f"https://financialmodelingprep.com/api/v4/earning-calendar-confirmed?from={today}&to={prev_earnings_cycle}&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V" , 
               'UE': f"https://financialmodelingprep.com/api/v3/earning_calendar?from={today}&to={one_earnings_cycle}&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V", 
               'N':"https://financialmodelingprep.com/api/v3/stock_news?page=0",
               'IS': f"https://financialmodelingprep.com/api/v3/income-statement/{ticker}?period=annual&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V"
               }

def get_docs_data(ticker, hotkey):
    if hotkey != 'N':
        url = hotkey_dict[hotkey]
        getter_dict = requests.get(url)
        getter_dict = getter_dict.json()
            
        for i in range(len(getter_dict)):
            for i in (getter_dict):
                if ticker == i['symbol']:
                    return i
                else:
                    return None
    elif hotkey == 'N':
        url = hotkey_dict[hotkey]
        getter_dict = requests.get(url)
        getter_dict = getter_dict.json()
        return getter_dict
hotkey= 'IS'
payload = get_docs_data(ticker, hotkey)
print(type(payload))



