import { ChatOpenAI } from "langchain/chat_models/openai";
import fs from "fs";
import { MozillaReadabilityTransformer } from "langchain/document_transformers/mozilla_readability";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { InMemoryCache } from "@langchain/core/caches";

var request = require('request');


const openai = new ChatOpenAI();
const apiKeyForOpenAI = "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"
const hotKeyMap = new Map();
const transformer = new MozillaReadabilityTransformer();


async function main(query) {

    hotkey, ticker = query.split("$");
    url = getURL(hotkey, ticker);
    jsonData = getAlphaVantageData(url);
    const sequence = splitter.pipe(transformer);
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
    const newDocuments = await sequence.invoke(docs);
    if (hotkey == 'GT'){
      //retrieve trends data
    }
  if (hotkey != 'GT') {
    const completion = await openai.chat.completions.create({
        messages: [{
            "role": "system", 

            "content": 
              
            "When the conversation starts. Greet the user as their personal stock strategy assistant. You will be provided with articles and you will use their data to summarize the information in the context of summarizing financial information. Please also remind them that you are not a financial advisor and that they should not take your advice as financial advice. Step 1: show them how to use the app. The app should be used with the following protocol: <hotkey> $ticker i.e: UE $APPL. Step 2: Advise the user of the hotkey definitions as follows: UE = Upcoming Earnings, ER = Earnings Report, N = News Sentiment"
            },

          {"role": "user", "content": {"prompt goes here"}},
                   
          {"role": "system", 
           
           "content": 
             
          "<Use the previous system message>  Use the stock ticker:" + ticker + "and use the hotkeys: " + hotkey + "as a guide for the context of what the user is asking for: UE = upcoming earnings report dates for the stock ticker that was given in the query, ER = provide the user with the date of the last dated earnings report along with eps add in any analyst estimates and surprise metrics, N = summarize any news for the given stock ticker in under 100 words. Here is the documents you can parse".join(newDocuments) },

                   
          {"role": "user", "content": {"prompt goes here"}},
            ],
        model: "gpt-4-turbo",
    });

    console.log(completion.choices[0]);
    }

function getSuggestions(ticker, query, documents) {
  const completion = await openai.chat.completions.create({
    messages: [{
      "role": "system", 
      "content": "use the documents available to you to suggest search terms associated with the stock ticker: " + ticker + ". Here are the available documents:".join(documents)
    },
    {"role" : "user",
     
     "content": " +query + "},
     
    {"role" : "assistant", "content" : "You are an assistant that is going to use the following stock ticker to provide 5 useful words that the user will use the stocks current popularity, you can use any news articles you have access to in order to add context with new products or services that is listed in the news articles. If there are no news articles, provide the stock tickers full company name if you are aware of it. Here is the ticker: " + ticker + "."
      
    }
    ],
    model: "gpt-4-turbo",
  });
}
function getAlphaVantageData(url) {
    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            // data is successfully parsed as a JSON object:
            return data;
        }
    });
}

function getURL(hotkey, ticker) {
    const urlMappings = new Map();
    urlMappings.set('UE', 'https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&symbol=symbols&apikey=demo');
    urlMappings.set('ER', 'https://www.alphavantage.co/query?function=EARNINGS&symbol=symbols&apikey=demo');
    urlMappings.set('N', 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=symbols&apikey=demo');
        // Additional hotkeys can be added here


    // Replace {symbol} placeholder with the actual ticker symbol
    return urlMappings[hotkey].replace('symbols', encodeURIComponent(ticker));
