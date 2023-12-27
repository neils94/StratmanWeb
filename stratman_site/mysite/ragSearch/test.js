const googleTrends = require('google-trends-api');
const date = new Date();

let year = date.getFullYear() -1 ;
let month = date.getMonth() ;
let day = date.getDate();


const newDate = new Date(year, month , day);


async function getInterestOverTime1(keyword) {
    
        const results = await  Promise.all([googleTrends.interestOverTime({ keyword, startTime: newDate })
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



// Example usage
(async () => {
    try {
        const [formattedTimeArray, query1Array, query2Array, query3Array] = await getInterestOverTime1(['AAPL', 'TSLA', 'Google']);
        console.log(formattedTimeArray); // Outputs the formatted time array
    } catch (error) {
        console.error('Error in processing:', error);
    }
})();