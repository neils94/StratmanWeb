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

    const completion = await openai.chat.completions.create({
        messages: [{
            "role": "system", 
            
            "content": 
            "When the conversation starts. Greet the user as their personal strategy assistant. Please also remind them that you are not a financial advisor and that they should not take your advice as financial advice. Then you may show them how to use the app. The app should be used with the following protocol: <hotkey> $ticker i.e: UE $APPL. Please also advise the user of the hotkey definitions as follows: UE = Upcoming Earnings, ER = Earnings Report, N = News Sentiment, GT = Google Trends."
            },

            {"role": "user", "content": {"prompt goes here"}},

            ],
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
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
}

