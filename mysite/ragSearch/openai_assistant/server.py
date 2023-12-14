from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import datetime
from migrations.MapReduceDocs import MapReduceDocs
import os
from PubSub import SimplePubSub

app = Flask(__name__)
CORS(app)
today = datetime.date.today()
one_earnings_cycle = today + datetime.timedelta(days=90)
prev_earnings_cycle = today - datetime.timedelta(days=90)
mapReduce = MapReduceDocs()

hotkey_dict = {'SA':["https://financialmodelingprep.com/api/v4/social-sentiments/change?type=bullish&source=stocktwits"], 
               'ER': ["https://financialmodelingprep.com/api/v4/earning-calendar-confirmed?from={today}&to={prev_earnings_cycle}&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V"] , 
               'UE': ["https://financialmodelingprep.com/api/v3/earning_calendar?from={today}&to={one_earnings_cycle}&apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V"], 
               'N':["https://financialmodelingprep.com/api/v3/stock_news?page=0"], 
               'AR':["https://financialmodelingprep.com/api/v3/analyst-stock-recommendations/{stock_ticker}?apikey=Zz7Qx2LHXU3lAzgtKyx4G93NENgtxm3V"]}


app = Flask(__name__)


@app.route('/search', methods=['POST'])
async def search(query):
    

if __name__ == '__main__':
    app.run(debug=True)
