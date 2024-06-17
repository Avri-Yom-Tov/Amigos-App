





const { ipcRenderer } = require('electron');
const { getCloudWatchLogs } = require('../utils/getCloudWatchLogs');

ipcRenderer.on('aws-logs-data', async (_, { name, type }) => {

    console.log('Received data :', { name, type });
    process.env.MODE && require('C:/Intel/accessories/setAWSCredentials.js');

    try {

        const backButton = document.getElementById("backButton");
        backButton.addEventListener("click", () => {
            ipcRenderer.send("navigate-to-main");
        });


        document.getElementById("loader").style.display = "none";
        document.querySelector(".container").style.display = "block";
        const logs = await getCloudWatchLogs(`dev-${name}`);

        document.getElementById("loader").style.display = "none";
        document.querySelector(".container").style.display = "block";
        document.querySelector(".container").innerHTML = "No Results Found !";


        const logsContainer = document.getElementById('logs');

        logs.forEach(log => {

            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';

            const timestamp = log.match(/^\[(.*?)\]/)[1];
            const level = log.includes('ERROR') ? 'ERROR' : 'INFO';

            logEntry.innerHTML = `
                <time>${timestamp}</time>
                <div class="level ${level}">${level}</div>
                <div class="content">${log.replace(/\x1B\[[0-9;]*m/g, '')}</div>
            `;

            logsContainer.appendChild(logEntry);
        });
    } catch (error) {
        console.error(error);
    }
});



