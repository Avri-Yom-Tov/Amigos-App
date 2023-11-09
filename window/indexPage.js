



// const runShellCommand = require("../utils/runShellCommand");
// const listFilesInDirectory = require("../accessories/listFilesInDirectory");
// const openFolder = require('../utils/openFolder');
// const openBrowser = require('../utils/openBrowser');
// const { ipcRenderer } = require('electron');

// window.onload = async () => {

//   const folderPath = "C:\\Works\\amigos-team";
//   const scriptsList = document.getElementById("scripts");
//   const workFolderRepositories = await listFilesInDirectory(folderPath);
//   workFolderRepositories.sort((a, b) => a - b);


//   const titleElement = document.querySelector('.title');

//   titleElement.addEventListener('click', (() => {

//   }));

//   workFolderRepositories.forEach(element => {
//     const card = document.createElement("li");
//     card.classList.add("collection-item");

//     const title = document.createElement("h4");
//     title.innerHTML = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
//     title.classList.add("card-title");

//     const body = document.createElement("p");

//     card.appendChild(title);
//     card.appendChild(body);

//     card.addEventListener('contextmenu', (event) => {
//       event.preventDefault();
//       ipcRenderer.send('pop-up-progress-bar', 2, 'Opening Folder ..');
//       console.log('contextmenu-click detected!');
//       openFolder(folderPath + "\\" + element);
//     });

//     let clickCount = 0;
//     let timer;

//     card.addEventListener('click', () => {
//       clickCount++;
//       clearTimeout(timer);

//       timer = setTimeout(() => {

//         if (clickCount === 1) {
//           ipcRenderer.send('pop-up-progress-bar', 1, 'Opening browser ..');
//           console.log(`${clickCount} click detected !`);
//           openBrowser(`https://github.com/nice-cxone/${element}`);
//         }

//         if (clickCount === 2) {
//           ipcRenderer.send('pop-up-progress-bar', 3, 'Vs code is opening ..');
//           console.log(`${clickCount} clicks detected !`);
//           runShellCommand(folderPath + "/" + element, 'code .', true);
//         }

//         clickCount = 0;
//       }, 300);

//     });


//     scriptsList.appendChild(card);
//   });
// };




const runShellCommand = require("../utils/runShellCommand");
const listFilesInDirectory = require("../accessories/listFilesInDirectory");
const openFolder = require('../utils/openFolder');
const openBrowser = require('../utils/openBrowser');
const { ipcRenderer } = require('electron');

window.onload = async () => {

  const folderPath = "C:\\Works\\amigos-team";
  const scriptsList = document.getElementById("scripts");
  const workFolderRepositories = await listFilesInDirectory(folderPath);
  workFolderRepositories.sort((a, b) => a - b);

  let listItems = [];

  workFolderRepositories.forEach(element => {
    const card = document.createElement("li");
    card.classList.add("collection-item");

    const title = document.createElement("h4");
    title.innerHTML = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
    title.classList.add("card-title");

    const body = document.createElement("p");

    card.appendChild(title);
    card.appendChild(body);

    card.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      ipcRenderer.send('pop-up-progress-bar', 2, 'Opening Folder ..');
      openFolder(folderPath + "\\" + element);
    });

    let clickCount = 0;
    let timer;

    card.addEventListener('click', () => {
      clickCount++;
      clearTimeout(timer);

      timer = setTimeout(() => {
        if (clickCount === 1) {
          ipcRenderer.send('pop-up-progress-bar', 1, 'Opening browser ..');
          openBrowser(`https://github.com/nice-cxone/${element}`);
        }

        if (clickCount === 2) {
          ipcRenderer.send('pop-up-progress-bar', 3, 'Vs code is opening ..');
          runShellCommand(folderPath + "/" + element, 'code .', true);
        }

        clickCount = 0;
      }, 300);
    });

    scriptsList.appendChild(card);
    listItems.push({ element, card });
  });

  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener('keyup', function () {
    let searchValue = searchBox.value.toLowerCase();
    filterRepositories(searchValue);
  });

  const filterRepositories = (searchValue) => {
    listItems.forEach(item => {
      const repoName = item.element.toLowerCase();
      const listItem = item.card;

      if (repoName.includes(searchValue)) {
        listItem.style.display = "";
      } else {
        listItem.style.display = "none";
      }
    });
  }
};



