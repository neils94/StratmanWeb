import { ChatOpenAI } from "langchain/chat_models/openai";
import { MomentoCache } from "langchain/cache/momento";
import { MozillaReadabilityTransformer } from "langchain/document_transformers/mozilla_readability";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { InMemoryCache } from "@langchain/core/caches";
import request from 'request';

// Environment variables should be used for sensitive information
const apiKeyForOpenAI = process.env.OPENAI_API_KEY;
const momentoAPIKey = process.env.MOMENTO_API_KEY;
const momentoRefreshToken = process.env.MOMENTO_REFRESH_TOKEN;

// Cache configuration
const cache = new MomentoCache({
  client: new CacheClient({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: momentoAPIKey,
    }),
    defaultTtlSeconds: 60 * 60 * 24, // 24 hours
  }),
  cacheName: "langchain",
});

// OpenAI instance
const openai = new ChatOpenAI({
  modelName: "gpt-4-turbo",
  cache: true
});

async function main(query) {
  const [hotkey, ticker] = query.split("$");
  const url = getURL(hotkey, ticker);
  const jsonData = await getAlphaVantageData(url);
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const transformer = new MozillaReadabilityTransformer();
  const sequence = splitter.pipe(transformer);
  const newDocuments = await sequence.invoke(jsonData); 
  if (hotkey === 'GT') {
    await getSuggestions(ticker, newDocuments);
    const BaseGoogleTrentHotKeyResponse = await openai.chat.completions.create({
        "role" : "system",
        "content": "Use the cache with to retrieve the last 5 stored values".join(ticker),
        
      })
    }
  if (hotkey != 'GT') {
    const BaseHotKeyResponse = await openai.chat.completions.create({
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

async function getSuggestions(ticker, documents) {
  const completion = await openai.chat.completions.create({
    messages: [{
      "role": "system", 
      "content": "use the documents available to you to suggest search terms associated with the stock ticker: " + ticker + ". Here are the available documents:".join(documents)
    },
    {"role" : "user",
     
     "content": "" +query + "."},
     
    {"role" : "assistant", "content" : "< use the system message above > Provide 5 useful words that the user will use the stocks current popularity, you can use any news articles you have access to in order to add context with new products or services that is listed in the news articles. If there are no news articles, provide the stock tickers full company name if you are aware of it. Here is the ticker: " + ticker + ". Then provide the user with two hotkeys: R = Regenerate, and KW = Keep words. If the user types R: regenerate 5 new words. If the user types Use: then store the words in a cache for another task."
    }
    ],
    model: "gpt-4-turbo",
  });
}
async function getAlphaVantageData(url) {
  try {
    const response = await request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    });
    if (response.statusCode === 200) {
      return response.body;
    } else {
      console.error('Error with status code:', response.statusCode);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
}


function getURL(hotkey, ticker) {
    const urlMappings = new Map();
    urlMappings.set('UE', 'https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&symbol=symbols&apikey=demo');
    urlMappings.set('ER', 'https://www.alphavantage.co/query?function=EARNINGS&symbol=symbols&apikey=demo');
    urlMappings.set('N', 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=symbols&apikey=demo');
        // Additional hotkeys can be added here


    // Replace {symbol} placeholder with the actual ticker symbol
    return urlMappings[hotkey].replace('symbols', encodeURIComponent(ticker));
