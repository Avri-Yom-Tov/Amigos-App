const { ipcRenderer } = require('electron');
const { getValue, setValue } = require('../accessories/electronStore');

const backButton = document.getElementById("backButton");
const ideSelect = document.getElementById('ideSelect');
const repoPath = document.getElementById('repoPath');
const credentialsPath = document.getElementById('credentialsPath');
const clearButton = document.getElementById('clearButton');

ideSelect.value = getValue('ideSelect') || 'vscode';


backButton.addEventListener("click", () => {
    ipcRenderer.send("navigate-to-main");
});

ideSelect.addEventListener('change', () => {
    const selectedIDE = ideSelect.value;
    setValue('ideSelect', selectedIDE);
});

repoPath.addEventListener('click', () => {
    ipcRenderer.send('open-directory-dialog');
});

credentialsPath.addEventListener('click', () => {
    ipcRenderer.send('open-file-dialog');
});

clearButton.addEventListener('click', () => {
    ipcRenderer.send('clear-all-from-store');
});
