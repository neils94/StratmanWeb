import { CacheClient, Configurations, CredentialProvider } from "@gomomento/sdk";
import { MozillaReadabilityTransformer } from "langchain/document_transformers/mozilla_readability";
import { CommaSeparatedListOutputParser } from "langchain/output_parsers";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import request from 'request';
import {OpenAI} from "langchain/llms/OpenAI";
import {
  CacheClient,
  Configurations,
  CredentialProvider,
} from "@gomomento/sdk"; 
import { ChatMessageHistory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import {LLMChain, SequentialChain } from "langchain/chains";

const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const googleTrends = require('google-trends-api');
var request = require('request')

// Environment variables should be used for sensitive information
const apiKeyForOpenAI = process.env.OPENAI_API_KEY;
const momentoAPIKey = process.env.MOMENTO_API_KEY;
const momentoRefreshToken = process.env.MOMENTO_REFRESH_TOKEN;

// Cache configuration


const client = new MomentoCache({
  client: new CacheClient({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: momentoAPIKey,
    }),
    defaultTtlSeconds: 60 * 60 * 24, // 24 hours
  }),
  cacheName: "langchain",
});

const cache = await MomentoCache.fromProps({
  client,
  cacheName: "langchain",
});

// OpenAI instance
const gpt4Suggestions = new OpenAI({modelName: "gpt-4-1106-preview",
cache,
streaming: true,
memory: new ChatMessageHistory(),
openAIApiKey: apiKeyForOpenAI});

const gpt4 = new OpenAI({modelName: "gpt-4-1106-preview",
cache,
streaming: true,
memory: new ChatMessageHistory(),
openAIApiKey: apiKeyForOpenAI});

// OpenAI instance
const gpt4Graphing = new OpenAI({modelName: "gpt-4-1106-preview",
cache,
memory: new ChatMessageHistory(),
openAIApiKey: apiKeyForOpenAI});


// declare the function 
const shuffle = (array) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 


const date = new Date();

let year = date.getFullYear() -1;
let month = date.getMonth() ;
let day = date.getDate();


const newDate = new Date(year, month , day);


// Endpoint to retrieve chat history
app.get('/api/history/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    const history = chatHistories[uuid] || [];
    res.json(history);
});

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

app.post('./script.js', async (req, res) => {
    const userInput = req.body.query;
    const response = await processQuery(userInput);
    res.send({ response: response });
});
app.post('./script.js', (req, res) => {
    const uniqueId = uuidv4(); // Generate a UUID
    const uniqueUrl = `/results/${uniqueId}`;
    // Cache the query with the UUID (implementation of cacheQuery not shown)
    // cacheQuery(uniqueId, req.body.query);
    res.send({ redirectUrl: uniqueUrl }); // Send back the unique URL
});
// Endpoint to save a new message (for demonstration)
app.post(`${uuid}`, (req, res) => {
    const uuid = req.params.uuid;
    const message = req.body.message;

    res.status(200).send('Message saved');
});




async function getSuggestions(ticker, documents) {
    const templateSuggest = 
    `You will be given a stock ticker and your job is to generate words to go with the ticker, if you know the full stock name use that in place of the ticker, otherwise just use the ticker. 
    Examples are: user provides: $APPL and you provide: 
    The goal is to provide suggestions that other people may be searching for related to the company or products. You may also use any articles available to you.
    Put the queries in the format of a JavaScript array where each query is delimited by a comma and the datatypes are strings.
    The word is ${ticker}} along with the following documents`.join(documents)
    const result = await gpt4Suggestions.invoke([templateSuggest], {
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      });
      return result;


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
    urlMappings.set('UE', 'https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&symbol=symbols&apikey=XJQRCFEMES4W32OJ');
    urlMappings.set('ER', 'https://www.alphavantage.co/query?function=EARNINGS&symbol=symbols&apikey=XJQRCFEMES4W32OJ');
    urlMappings.set('N', 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=symbols&apikey=XJQRCFEMES4W32OJ');
        // Additional hotkeys can be added here


    // Replace {symbol} placeholder with the actual ticker symbol
    return urlMappings.get(hotkey).replace('symbols', encodeURIComponent(ticker));
}

async function getTopRelatedGoogleTrends(keyword) {
    try {
        // Fetch related queries and topics
        const relatedQueriesResult = await Promise.all([
            googleTrends.relatedQueries({ keyword }),
        ]);

        // Parse and extract top 5 related queries
        const relatedQueries = JSON.parse(relatedQueriesResult).default.rankedList[0].rankedKeyword.slice(0, 5);
        const topRelatedQueries = relatedQueries.map(query => query.query);

        return {
            topRelatedQueries,
        };
    } catch (error) {
        console.error('Error fetching Google Trends data:', error);
        return null;
    }
}
async function getInterestOverTime(keywords) {
    
    const results = await  Promise.all([googleTrends.interestOverTime({ keyword: keywords, startTime: newDate })
    ]);
    const parsedData = JSON.parse(results);
    

    // Extract timelineData
    const timelineData = parsedData.default.timelineData;
    const formattedTimeArray = [];
    const query1Array = [];
    const query2Array = [];
    const query3Array = [];

    // Iterate over each item in timelineData and extract the values
    timelineData.forEach(item => {
        const query1Value = item.value[0];
        const query2Value = item.value[1];
        const query3Value = item.value[2];
        formattedTimeArray.push(item.formattedTime);
        query1Array.push(query1Value);
        query2Array.push(query2Value);
        query3Array.push(query3Value);
    });

    // Return an array of the results
    return [formattedTimeArray, query1Array, query2Array, query3Array]
    }  



async function getGoogleTrendsGraph(keywords) {
    const [formattedTimeArray, query1Array, query2Array, query3Array] = await getInterestOverTime(keywords=keywords);
    prompt = new PromptTemplate({ template:
        `plot these arrays in one graph: ${formattedTimeArray}, ${query1Array}, ${query2Array}, ${query3Array} the dates will be the x axis using formattedTimeArray and the intervals will go from 0-52 evenly spaced, each time value represents 1 week in the last year. Values on the y axis range from 0-100 to represent % of interest. Name the plot interest over time and give a legend with 3 distinct colors using these ${keywords} keywords to label them`,
});
    chainForGraph = new LLMChain({llm:gpt4Graphing, prompt: keyword}); 
}


async function processQuery(query) {
    if (query.includes("$")){
        const [hotkey, ticker] = query.split("$");
        const url = getURL(hotkey, ticker);
        const jsonData = await getAlphaVantageData(url);
        const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
        const transformer = new MozillaReadabilityTransformer();
        const sequence = splitter.pipe(transformer);
        const newDocuments = await sequence.invoke(jsonData);
        if (!query) return; // Exit if query is empty
        if (hotkey === 'UE'); or (hotkey === 'N'); or (hotkey === 'ER'); {
            const templateForMain = 
            `You are a stock strategy assistant that helps users make more informed decisions.
            "When the conversation starts. 
            Greet the user as their personal stock strategy assistant. 
            You will be provided with articles and you will use their data to summarize the information in the context of summarizing financial information. 
            Please also remind them that you are not a financial advisor and that they should not take your advice as financial advice.
            Step 1: show them how to use the app. 
            The app should be used with the following protocol: hotkey $ticker i.e: UE $APPL. 
            Step 2: Show the user the menu of the hotkey definitions as follows: UE = Upcoming Earnings, ER = Earnings Report, N = News for a given stock. 
            Here is the documents you will have access to"
            
            Ticker: {ticker}
            Hotkeys: {hotkeys}
            Here is the documents you have access to`.join(newDocuments);
            chain1 = new LLMChain({llm:gpt4, prompt: templateForMain});
            console.log("Query Processed:", chain1);
            
        }   elseif (hotkey === 'GT'); {
                const queryArray = []
                const suggestions = await getSuggestions(ticker, newDocuments);
                const topQueries = await getTopRelatedGoogleTrends(ticker);
                queryArray.push(topQueries);
                queryArray.push(suggestions);
                const randomized_array = shuffle(queryArray).slice(0,3);
                //interest over time
                const [formattedTimeArray, query1Array, query2Array, query3Array] = await getInterestOverTime(keywords=keywords);
                prompt = new PromptTemplate({ template:
                    `plot these arrays in one graph: ${formattedTimeArray}, ${query1Array}, ${query2Array}, ${query3Array} the dates will be the x axis using formattedTimeArray and the intervals will go from 0-52 evenly spaced, each time value represents 1 week in the last year. Values on the y axis range from 0-100 to represent % of interest. Name the plot interest over time and give a legend with 3 distinct colors using these ${keywords} keywords to label them`,
                    });
                chainForGraph = new LLMChain({llm:gpt4Graphing, prompt: keyword});          
                console.log("Query Processed:", chainForGraph);
            }
        }
        else {
            const miscTemplate = 
            `You are a stock strategy assistant that helps users make more informed decisions.
            Show the user how to use the application with the following protocol:
            Step 1: The app should be used with the following protocol: hotkey $ticker i.e: UE $APPL. Hotkeys are used to find specific types of information and the ticker is used to find information about a specific stock.
            Step 2: Show the user the menu of the hotkey definitions as follows: UE = Upcoming Earnings, ER = Earnings Report, N = News for a given stock, GT =  Google Trends related search queries, recommendations from GPT for search queries and topics, and a graph of interest over time for the last year.  
            If the users question doesn't follow the guidelines for hotkeys, try to answer the question to the best of your ability.
            `
            miscChain = new LLMChain({llm:gpt4, prompt: miscTemplate});
            console.log("Query Processed:", miscChain);
    }
  };

module.exports = { processQuery };
