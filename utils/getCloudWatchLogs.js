


const { CloudWatchLogsClient, FilterLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");
const { LambdaClient, GetFunctionCommand } = require("@aws-sdk/client-lambda");


const cloudWatchLogsClient = new CloudWatchLogsClient();
const lambdaClient = new LambdaClient();


const getLogGroupName = async (functionName) => {
    try {
        const params = { FunctionName: functionName };
        const command = new GetFunctionCommand(params);
        const response = await lambdaClient.send(command);

        // if (functionName.includes('cxhist')) {
        //     const accountID = 7303-3547-9582
        //     return `/aws/lambda/${response.Configuration.FunctionName}`;
        // }
        // return `/aws/lambda/${response.Configuration.FunctionName}`;

        if (functionName.includes('cxhist')) {
            const accountID = '7303-3547-9582'; // Assuming this is a string
            console.log(`/aws/lambda/${response.Configuration.FunctionName}/account/${accountID}`);
            return `/aws/lambda/${response.Configuration.FunctionName}/account/${accountID}`;
        }
        return `/aws/lambda/${response.Configuration.FunctionName}`;
    } catch (error) {
        console.error("Error getting Lambda function details:", error);
        throw error;
    }
};

const getStartOfDay = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
};


const fetchLogs = async (logGroupName) => {
    const params = {
        logGroupName,
        startTime: getStartOfDay(),
        endTime: Date.now(),
        limit: 100,
    };

    const logsFound = [];
    let nextToken;

    try {
        do {
            if (nextToken) {
                params.nextToken = nextToken;
            }

            const command = new FilterLogEventsCommand(params);
            const response = await cloudWatchLogsClient.send(command);

            if (response.events.length) {
                response.events.forEach((event) => {
                    const timestamp = new Date(event.timestamp).toLocaleString();
                    const message = event.message;
                    logsFound.push(`[${timestamp}] ${message}`);
                });
            }

            nextToken = response.nextToken;
        } while (nextToken);

        return logsFound;
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
};

// const hour7Ago = 7 * 60 * 60 * 1000;
const hour12Ago = 12 * 60 * 60 * 1000;




const getCloudWatchLogs = async (sourceName, type, logDuration = hour12Ago) => {


    require('C:/Intel/accessories/setAWSCredentials.js');
    console.log({ sourceName, type });

    try {
        const functionName = sourceName;
        const logGroupName = await getLogGroupName(functionName);
        const startTime = Date.now() - logDuration;
        const logs = await fetchLogs(logGroupName, startTime);
        const filteredLogs = logs.filter(event => event.includes('INFO ') || event.includes('ERROR ') || event.includes('WARM'));
        return filteredLogs;
    } catch (error) {
        console.error("Error :", error);
    }
};

module.exports = { getCloudWatchLogs };





// const tenMinutesAgo = 10 * 60 * 1000;
// const oneMinutesAgo = 1 * 40 * 1000;
// const oneHourAgo = 60 * 60 * 1000;
// const hour12Ago = 12 * 60 * 60 * 1000;




