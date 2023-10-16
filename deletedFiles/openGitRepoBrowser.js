
const { ipcRenderer } = require('electron');
const readFile = require("../utils/readFile");
const path = require("path");
const openBrowser = require('../utils/openBrowser');

(async () => {



    const folderName = 'data';
    const rootDir = path.resolve(__dirname, '..');
    const filePathToSave = path.join(rootDir, folderName);
    const totalFilePath = path.join(filePathToSave, 'filtered-repositories.txt');
    let repositoriesFromFile;
    try {
        repositoriesFromFile = await readFile(totalFilePath);
        repositoriesFromFile = JSON.parse(repositoriesFromFile);
    } catch (error) {
        console.log(error);
        alert("עדכן כדי להמשיך !");
        return;
    }



    repositoriesFromFile.sort();
    if (repositoriesFromFile) {

        const container = document.querySelector('.wrap');
        repositoriesFromFile.forEach((item) => {


            const boxDiv = document.createElement('div');
            boxDiv.className = 'box';
            boxDiv.style.cursor = 'default';
            const boxTopDiv = document.createElement('div');
            boxTopDiv.className = 'box-top';
            const titleFlexDiv = document.createElement('div');
            titleFlexDiv.className = 'title-flex';
            const h3Title = document.createElement('h3');
            h3Title.className = 'box-title';
            h3Title.innerText = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            const pUserInfo = document.createElement('p');
            pUserInfo.className = 'user-follow-info';
            // pUserInfo.innerText = new Date(item.created_at).toLocaleString();
            titleFlexDiv.appendChild(h3Title);
            titleFlexDiv.appendChild(pUserInfo);
            boxTopDiv.appendChild(titleFlexDiv);
            boxDiv.appendChild(boxTopDiv);







            boxDiv.addEventListener('click', () => {
                console.log(item);
                openBrowser(item.html_url);
            });




            container.appendChild(boxDiv);
        });




        let style = document.createElement("style");


        document.head.appendChild(style);



        const backButton = document.getElementById('backButton');
        backButton.addEventListener('click', () => {
            ipcRenderer.send('navigate-to-main');
        });
    }
    else {
        alert("עדכן כדי להמשיך !");
    }


})();



