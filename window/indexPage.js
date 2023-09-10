


const runShellCommand = require("../utils/runShellCommand");
const listFilesInDirectory = require("../accessories/listFilesInDirectory");


window.onload = async () => {

  const folderPath = "C:/Works/amigos-team";
  const scriptsList = document.getElementById("scripts");
  const workFolderRepositories = await listFilesInDirectory(folderPath);
  // workFolderRepositories.reverse();
  workFolderRepositories.sort();

  workFolderRepositories.forEach(element => {
    const card = document.createElement("li");
    card.classList.add("collection-item");

    const title = document.createElement("h4");
    title.innerHTML = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();

    title.classList.add("card-title");

    const body = document.createElement("p");

    card.appendChild(title);
    card.appendChild(body);

    card.onclick = async () => {

      runShellCommand(folderPath + "/" + element, 'code .', true);
      console.log(element);
    };

    scriptsList.appendChild(card);
  });

};



























// const { ipcRenderer } = require("electron");
// ipcRenderer.send("run-script", script);